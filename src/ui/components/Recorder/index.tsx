import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RecordRTC, { Options as RecordRtcOptions } from "recordrtc";
import { blobToBase64String } from "blob-util";
import STATES from "./states";
import { NameTypes } from "../../../types/resources/name";
import ControllerContext from "../../contexts/controller";
import useSliderState from "../../hooks/useSliderState";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";
import getSpec from "./machine/get-spec";
import Pronunciation from "../../../types/resources/pronunciation";
import { EVENTS } from "./types/machine";
import { RecorderCloseOptions } from "./types/handlers-types";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import SystemContext from "../../contexts/system";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../../types/style-context";
import View from "./Views";
import {
  COUNTDOWN,
  DEFAULT_SAMPLE_RATE,
  MAX_ALLOWED_FILE_SIZE,
  ONE_SECOND,
  TEN_SECONDS,
  TIMER,
} from "./constants";
import { InboundRelativeSource } from "./types/inbound-relative-source";
import { SampleRate } from "./types/sample-rate";
import { logRecordingDeviceInfo } from "../../../core/utils/log-recording-device-info";
interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClose: (option?: RecorderCloseOptions) => void;
  onSaved?: (blob?: Blob) => void;
  termsAndConditions?: TermsAndConditions;
  pronunciation?: Pronunciation;
  relativeSource?: InboundRelativeSource;
}

const Recorder = ({
  onRecorderClose,
  name,
  owner,
  type,
  termsAndConditions,
  onSaved,
  pronunciation,
  relativeSource,
}: Props): JSX.Element => {
  // CONTEXTS
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);
  const systemContext = useContext(SystemContext);

  // MONITORING
  const logger = systemContext?.logger;
  const log = (message: string): void => logger.log(message, "Recorder");
  const errorHandler = systemContext?.errorHandler;

  // CUSTOM HOOKS
  const customFeatures = useCustomFeatures(controller, styleContext);
  const { t } = useTranslator(controller, styleContext);
  const { theme } = useTheme();
  const [slider, openSlider, closeSlider] = useSliderState();

  const { can, show } = useFeaturesManager(
    controller.permissions,
    customFeatures
  );

  const canCustomAttributesCreate = useMemo(
    () =>
      can(
        "createCustomAttributes",
        owner || controller.nameOwnerContext,
        controller.userContext,
        controller.customAttributes
      ),
    [controller, owner]
  );
  const showRecordButton = show(
    "recorderRecordButton",
    pronunciation,
    owner?.signature
  );
  const showDeleteButton = can("destroyPronunciation", pronunciation);

  const themeIsDefault = useMemo(() => theme === Theme.Default || !theme, [
    theme,
  ]);

  const machineSpec = useMemo(
    () => getSpec({ canCustomAttributesCreate, themeIsDefault }),
    [canCustomAttributesCreate, theme]
  );

  const displaySaving =
    styleContext?.displayRecorderSavingMessage ||
    machineSpec.canCustomAttributesCreate;

  const defaultSampleRate = { value: DEFAULT_SAMPLE_RATE };

  // HOOKS
  const [step, setStep] = useState(machineSpec.initialState);
  const [timer, setTimer] = useState(TIMER);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN);
  const [blob, setBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [showSlider, setShowSlider] = useState<boolean>(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [fileSizeError, setFileSizeError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [sampleRate, setSampleRate] = useState<SampleRate>(defaultSampleRate);
  const [tempSampleRate, setTempSampleRate] = useState<{ value: number }>(
    defaultSampleRate
  );

  const currentStep = useRef(step);
  const recorder: React.MutableRefObject<RecordRTC> = useRef(null);

  currentStep.current = step;

  // INNER FUNCTIONS
  const sendEvent = useCallback(
    (event) => {
      const transition = machineSpec.transitions.find((t) => t.name === event);

      if (!transition) throw new Error("Unknown event");

      if (
        transition.from.includes(currentStep.current) ||
        transition.from === "*"
      )
        return setStep(transition.to);

      throw new Error("Inconsistent state");
    },
    [machineSpec.transitions]
  );

  const onStop = async (): Promise<void> => {
    const stopRecording = (): Promise<unknown> =>
      new Promise((resolve) =>
        recorder.current.stopRecording(() => resolve(1))
      );
    await stopRecording();

    const blob = recorder.current.getBlob();
    const _audioUrl = URL.createObjectURL(blob);

    setBlob(blob);
    setAudioUrl(_audioUrl);

    const internalRecorder = recorder.current.getInternalRecorder() as any;
    log(`Recorder Sample Rate: ${internalRecorder.sampleRate}`);
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

  const onTermsAndConditionsAccept = async (): Promise<void> => {
    sendEvent(EVENTS.accept);
    termsAndConditions.onAccept();
  };

  const onStart = async (): Promise<void> => {
    setCountdown(COUNTDOWN);
    setTimer(TIMER);
    try {
      sendEvent(EVENTS.start);

      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const audioCtxSampleRate = audioCtx.sampleRate;

      log(`BaseAudioContext.sampleRate: ${audioCtxSampleRate}`);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      await logRecordingDeviceInfo(stream, log);

      log(`gpdb-widget pitch current sample rate: ${sampleRate.value}`);

      if (defaultSampleRate.value !== audioCtxSampleRate) {
        defaultSampleRate.value = audioCtxSampleRate;
        log(`AudioContext sample rate will be used as Default sample rate`);
        setSampleRate({ value: audioCtxSampleRate });
        log(`audio context sample rate is used as current pitch value`);
      }

      const options = {
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: "audio/wav",
        noWorker: true,
        sampleRate: sampleRate.value,
      } as RecordRtcOptions;

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
      errorHandler && errorHandler(error, "recorder");
    }
  };

  const onSave = async (): Promise<void> => {
    setSaving(true);

    sendEvent(EVENTS.save);
    const str = await blobToBase64String(blob);

    await controller.createRecording(name, type, str, owner);

    setSaving(false);

    if (onSaved) onSaved(blob);

    if (machineSpec.canCustomAttributesCreate === true && themeIsDefault)
      return sendEvent(EVENTS.customAttrs);

    onRecorderClose();
  };

  const onCustomAttributesSaved = () => setTimeout(onRecorderClose, ONE_SECOND);
  const onCustomAttributesBack = (): void => sendEvent(EVENTS.stop);

  // SAMPLE RATE
  const onDefaultSampleRateClick = (): void => setSampleRate(defaultSampleRate);
  const onSampleRateCancel = (): void => {
    closeSlider();
    setSampleRate(tempSampleRate);
  };
  const onSampleRateSave = (): void => {
    closeSlider();
    setTempSampleRate(sampleRate);
    controller.saveAudioSampleRate(sampleRate.value);
    log(`Pitch sample rate is saved. New value: ${sampleRate.value}`);
  };
  const onUpdateSampleRate = (val: number): void =>
    setSampleRate({ value: val });

  // UPLOADER
  const onUploaderChange = (e): void => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    if (files[0].size > MAX_ALLOWED_FILE_SIZE) return setFileSizeError(true);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(files[0]);
    fileReader.onload = (e): void => {
      const blob = new Blob([e.target.result]);
      const _audioUrl = URL.createObjectURL(blob);

      setBlob(blob);
      setAudioUrl(_audioUrl);
      setShowSlider(false);
      setFileSizeError(false);

      sendEvent(EVENTS.stop);
    };
  };

  const onDeletePronunciation = async (): Promise<void> =>
    onRecorderClose(RecorderCloseOptions.DELETE);

  const handleOnRecorderClose = (): void =>
    onRecorderClose(RecorderCloseOptions.CANCEL);

  useEffect(() => {
    if (termsAndConditions) {
      termsAndConditions.isAccepted().then((isAccepted) => {
        isAccepted || setStep(STATES.TERMS_AND_CONDITIONS);
      });
    }
  }, [termsAndConditions, termsAndConditions?.isAccepted]);

  return (
    <StyleContext.Provider
      value={{
        displayRecorderSavingMessage:
          styleContext?.displayRecorderSavingMessage,
        customFeatures,
        t,
        theme,
      }}
    >
      <View
        recorderProps={{
          step,
          countdown,
          timer,
          onStart,
          onStop,
          onSave,
          handleOnRecorderClose,
          displaySaving,
          saving,
          showDeleteButton,
          showRecordButton,
          audioUrl,
          machineSpec,
          onRecorderClose,
        }}
        termsAndConditionsProps={{
          termsAndConditions,
          onTermsAndConditionsAccept,
        }}
        sliderProps={{
          slider,
          openSlider,
          showSlider,
          closeSlider,
        }}
        sampleRateProps={{
          onDefaultSampleRateClick,
          onSampleRateCancel,
          onSampleRateSave,
          onUpdateSampleRate,
          sampleRate,
        }}
        uploaderProps={{ onUploaderChange, fileSizeError }}
        customAttributesProps={{
          onCustomAttributesBack,
          onCustomAttributesSaved,
        }}
        owner={owner}
        pronunciation={pronunciation}
        onDeletePronunciation={onDeletePronunciation}
        relativeSource={relativeSource}
      />
    </StyleContext.Provider>
  );
};

export default Recorder;
