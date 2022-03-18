import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RecordRTC, { Options } from "recordrtc";
import { blobToBase64String } from "blob-util";
import RangeInput from "./RangeInput";
import STATES from "./states";
import Player from "../Player";
import Close from "../Close";
import Settings from "./Settings";
import { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import ControllerContext from "../../contexts/controller";
import Loader from "../Loader";
import useSliderState from "../../hooks/useSliderState";
import { ErrorHandler, TermsAndConditions } from "../../hooks/useRecorderState";
import { NameOwner } from "gpdb-api-client";
import ReactTooltip from "react-tooltip";
import { SAVE_PITCH_TIP } from "../../../constants";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import StyleContext from "../../contexts/style";
import getSpec, { EVENTS } from "./machine/spec";
import CustomAttributes from "../CustomAttributes";
import loadCustomFeatures from "../../hooks/loadCustomFatures";
import loadT from "../../hooks/LoadT";

const COUNTDOWN = 3;
const TIMER = 0;
const ONE_SECOND = 1000;
const TEN_SECONDS = ONE_SECOND * 10;

const MAX_SAMPLE_RATE = 96000;
const DEFAULT_SAMPLE_RATE = 44100;
const MIN_SAMPLE_RATE = 22050;

interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClose: () => void;
  onSaved?: (blob?: Blob) => void;
  termsAndConditions?: TermsAndConditions;
  errorHandler?: ErrorHandler;
}

const cx = classNames.bind(styles);

const Recorder = ({
  onRecorderClose,
  name,
  owner,
  type,
  termsAndConditions,
  errorHandler,
  onSaved,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const machineSpec = useMemo(() => getSpec(controller, owner), [
    controller,
    owner,
  ]);

  const styleContext = useContext(StyleContext);
  const customFeatures =
    styleContext.customFeatures ||
    loadCustomFeatures(controller?.preferences?.custom_features);
  const t = styleContext.t || loadT(controller?.preferences?.translations);
  const displaySaving =
    styleContext?.displayRecorderSavingMessage ||
    machineSpec.canCustomAttributesCreate;

  const defaultSampleRate = { value: DEFAULT_SAMPLE_RATE };

  const { isDeprecated: isOld } = userAgentManager;

  const [step, setStep] = useState(machineSpec.initialState);
  const [timer, setTimer] = useState(TIMER);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN);
  const [blob, setBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [showSlider, setShowSlider] = useState<boolean>(true);
  const [slider, openSlider, closeSlider] = useSliderState();
  const [timeoutId, setTimeoutId] = useState(null);
  const [fileSizeError, setFileSizeError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [sampleRate, setSampleRate] = useState<{ value: number }>(
    defaultSampleRate
  );
  const [tempSampleRate, setTempSampleRate] = useState<{ value: number }>(
    defaultSampleRate
  );

  const currentStep = useRef(step);
  const recorder = useRef(null);

  currentStep.current = step;

  if (termsAndConditions)
    useEffect(() => {
      termsAndConditions.isAccepted().then((isAccepted) => {
        isAccepted || setStep(STATES.TERMS_AND_CONDITIONS);
      });
    }, [termsAndConditions.isAccepted]);

  const sendEvent = useCallback(
    (event) => {
      const transition = machineSpec.transitions.find((t) => t.name === event);

      if (!transition) throw new Error("Unknown event");

      if (
        transition.from.includes(currentStep.current) ||
        transition.from === "*"
      ) {
        setStep(transition.to);
      } else throw new Error("Inconsistent state");
    },
    [step]
  );

  const onStop = async (): Promise<void> => {
    const stopRecording = (): Promise<unknown> =>
      new Promise((resolve) =>
        recorder.current.stopRecording(() => resolve(1))
      );
    await stopRecording();

    const b = recorder.current.getBlob();
    const a = URL.createObjectURL(b);

    setBlob(b);
    setAudioUrl(a);

    recorder.current.destroy();

    sendEvent(EVENTS.stop);
  };

  const onReady = async (): Promise<void> => {
    sendEvent(EVENTS.ready);

    if (timeoutId) clearTimeout(timeoutId);

    const delayTimer = (): void => {
      if (currentStep.current !== STATES.RECORD) return;

      setTimeout(() => {
        setTimer((timer) => timer + 1);
        delayTimer();
      }, ONE_SECOND);
    };

    recorder.current.startRecording();
    setTimeoutId(
      setTimeout(
        () => currentStep.current === STATES.RECORD && onStop(),
        TEN_SECONDS
      )
    );
    delayTimer();
  };

  const onAccept = async (): Promise<void> => {
    sendEvent(EVENTS.accept);
    termsAndConditions.onAccept();
  };

  const onStart = async (): Promise<void> => {
    setCountdown(COUNTDOWN);
    setTimer(TIMER);
    try {
      sendEvent(EVENTS.start);

      const options = {
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: "audio/wav",
        noWorker: true,
        sampleRate: sampleRate.value,
      } as Options;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new RecordRTC(stream, options);

      Array.from({ length: COUNTDOWN }, (_, index) => {
        const st = index + 1;

        setTimeout(() => {
          setCountdown((countdown) => --countdown);
          if (st === COUNTDOWN) onReady();
        }, st * 950);
      });
    } catch (error) {
      setTimeout(() => sendEvent(EVENTS.fail), 0);
      if (errorHandler) errorHandler.capture(error);
    }
  };

  const onSave = async (): Promise<void> => {
    setSaving(true);

    sendEvent(EVENTS.save);
    const str = await blobToBase64String(blob);

    await controller.createRecording(name, type, str, owner);

    setSaving(false);

    if (onSaved) onSaved(blob);

    if (!machineSpec.canCustomAttributesCreate) onRecorderClose();
    if (machineSpec.canCustomAttributesCreate) sendEvent(EVENTS.customAttrs);
  };

  const onCustomAttributesSaved = () => setTimeout(onRecorderClose, ONE_SECOND);

  const onCustomAttributesBack = (): void => sendEvent(EVENTS.stop);

  const setSampleRateToDefault = (): void => {
    setSampleRate(defaultSampleRate);
  };

  const onSampleRateCancel = (): void => {
    closeSlider();
    setSampleRate(tempSampleRate);
  };

  const onSampleRateSave = (): void => {
    closeSlider();
    setTempSampleRate(sampleRate);
    controller.saveAudioSampleRate(sampleRate.value);
  };

  const onUploaderChange = (e): void => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // 5MB
    if (files[0].size > 5242880) {
      setFileSizeError(true);

      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(files[0]);
    fileReader.onload = (e): void => {
      const b = new Blob([e.target.result]);
      const a = URL.createObjectURL(b);

      setBlob(b);
      setAudioUrl(a);
      setShowSlider(false);
      setFileSizeError(false);

      sendEvent(EVENTS.stop);
    };
  };

  const updateSampleRate = (val): void => setSampleRate({ value: val });

  return (
    <StyleContext.Provider
      value={{
        displayRecorderSavingMessage:
          styleContext?.displayRecorderSavingMessage,
        customFeatures,
        t,
      }}
    >
      <div className={cx(styles.recorder, { old: isOld })}>
        {[STATES.STARTED, STATES.RECORD, STATES.FAILED].includes(step) && (
          <Close onClick={onRecorderClose} />
        )}
        <div className={cx(styles.recorder__body, { old: isOld })}>
          {step === STATES.TERMS_AND_CONDITIONS && termsAndConditions.component}

          {step === STATES.INIT &&
            "To make your own recording, click ‘Start’ and wait for the 3 second countdown. Then say the name you’re recording and click the ‘Stop’ recording button."}

          {step === STATES.STARTED && (
            <>
              <span className="flex-1">Recording starts in</span>
              <div className={styles.recorder__countdown}>{countdown}</div>
            </>
          )}

          {step === STATES.RECORD && (
            <>
              <span className="flex-1">Pronounce your name</span>
              <div className={styles.recorder__timer}>00:0{timer} - 00:10</div>
            </>
          )}

          {step === STATES.RECORDED && (
            <div className={styles.inline}>
              <Player audioSrc={audioUrl} icon="playable" className="player" />
              {showSlider && <Settings onClick={openSlider} active={slider} />}
            </div>
          )}

          {step === STATES.FAILED && (
            <>
              <span>Allow microphone and try again, please.</span>
              <div className={cx(styles.uploader, { old: isOld })}>
                <div className={styles.uploader__message}>
                  If you are having trouble with your microphone, please upload
                  an mp3 file.
                </div>
                <div className={styles.uploader__action}>
                  <label
                    htmlFor="pronunciation-upload"
                    className={styles.upload__label}
                  >
                    Upload
                  </label>
                  <input
                    type="file"
                    id="pronunciation-upload"
                    name="recording"
                    accept=".mp3"
                    onChange={onUploaderChange}
                  />
                </div>
              </div>
              {fileSizeError && (
                <div className={styles.error}>File max size is 5 MB</div>
              )}
            </>
          )}
        </div>
        <div className={styles.recorder__actions}>
          {step === STATES.TERMS_AND_CONDITIONS && (
            <>
              <button onClick={onRecorderClose}>
                {t("recorder_back_button", "BACK")}
              </button>
              <button onClick={onAccept}>ACCEPT</button>
            </>
          )}

          {step === STATES.INIT && (
            <>
              <button onClick={onRecorderClose}>
                {t("recorder_back_button", "BACK")}
              </button>
              <button onClick={onStart}>
                {t("recorder_start_button", "START")}
              </button>
            </>
          )}

          {step === STATES.RECORD && <button onClick={onStop}>STOP</button>}

          {step === STATES.RECORDED && slider && (
            <>
              <RangeInput
                max={MAX_SAMPLE_RATE}
                min={MIN_SAMPLE_RATE}
                values={[sampleRate.value]}
                onChange={updateSampleRate}
                onDefaultClicked={setSampleRateToDefault}
              />

              <button onClick={onSampleRateCancel} className={styles.secondary}>
                BACK
              </button>

              <button data-tip={SAVE_PITCH_TIP} onClick={onSampleRateSave}>
                SAVE PITCH
              </button>

              <ReactTooltip
                uuid="save_pitch_tooltip_id"
                multiline
                eventOff="mouseout"
                textColor="white"
                backgroundColor="#946cc1"
              />
            </>
          )}
          {step === STATES.RECORDED && !slider && (
            <>
              <button className={styles.no__border} onClick={onRecorderClose}>
                CLOSE
              </button>
              <button onClick={onStart}>RERECORD</button>
              <button onClick={onSave}>SAVE PRONUNCIATION</button>
            </>
          )}
        </div>
        {step === STATES.SAVED && (
          <>
            {displaySaving &&
              (saving ? "Saving your pronunciation" : "Pronunciation saved!")}
            <Loader inline />
          </>
        )}
        {step === STATES.CUSTOM_ATTRS && machineSpec.canCustomAttributesCreate && (
          <>
            <CustomAttributes
              disabled={false}
              saving
              noBorder
              owner={owner}
              onCustomAttributesSaved={onCustomAttributesSaved}
              onBack={onCustomAttributesBack}
              onRecorderClose={onRecorderClose}
            />
          </>
        )}
      </div>
    </StyleContext.Provider>
  );
};

export default Recorder;
