import { blobToBase64String } from "blob-util";
import { NameOwner } from "gpdb-api-client";
import React, { useContext, useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";
import { NameTypes } from "../../../../types/resources/name";
import Pronunciation from "../../../../types/resources/pronunciation";
import { config as configuration } from "../machine/configurations/default";
import { STATES } from "../machine/states";
import { EVENTS } from "../types/events";
import { COUNTDOWN, ONE_SECOND, TEN_SECONDS, TIMER } from "../constants";
import { RecorderCloseOptions } from "../types/handlers-types";
import { InboundRelativeSource } from "../types/inbound-relative-source";
import ControllerContext from "../../../contexts/controller";
import { RecorderContext } from "../contexts/recorder";
import StyleContext from "../../../contexts/style";
import SystemContext from "../../../contexts/system";
import useMachineSpec from "./useMachineSpec";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import useSampleRate from "./useSampleRate";
import useSliderState from "../../../hooks/useSliderState";
import useRecordRTC from "./useRecordRTC";
import Children from "../../../../types/children-prop";

interface RecorderProps {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClose: (option?: RecorderCloseOptions) => void;
  onSaved?: (blob?: Blob) => void;
  termsAndConditions?: TermsAndConditions;
  pronunciation?: Pronunciation;
  relativeSource?: InboundRelativeSource;
}

interface ProviderProps {
  children: Children;
  value: RecorderProps;
}

export const RecorderProvider = ({
  children,
  value,
}: ProviderProps): JSX.Element => {
  const {
    onRecorderClose,
    name,
    owner,
    type,
    termsAndConditions,
    onSaved,
    pronunciation,
    relativeSource,
  } = value;

  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);
  const systemContext = useContext(SystemContext);

  // MONITORING
  const logger = systemContext?.logger;
  const log = (message: string): void => logger.log(message, "Recorder");
  const errorHandler = systemContext?.errorHandler;
  // MONITORING

  // CUSTOM HOOKS
  const {
    currentSampleRate,
    setCurrentSampleRate,
    defaultSampleRate,
    setDefaultSampleRate,
    useDefaultSampleRate,
    setDeviceLabel,
    deviceLabel,
  } = useSampleRate();
  const [slider, openSlider, closeSlider] = useSliderState();
  const initRecorder = useRecordRTC({
    log,
    defaultSampleRate,
    setDefaultSampleRate,
    setDesiredSampleRate: setCurrentSampleRate,
    desiredSampleRate: currentSampleRate,
    setDeviceLabel,
  });
  // CUSTOM HOOKS ENDS

  const displaySaving = styleContext?.displayRecorderSavingMessage;

  const { sendEvent, currentStep } = useMachineSpec(configuration);

  // HOOKS
  const [timer, setTimer] = useState(TIMER);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN);
  const [blob, setBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [timeoutId, setTimeoutId] = useState(null);
  const [saving, setSaving] = useState<boolean>(false);

  const recorder: React.MutableRefObject<RecordRTC> = useRef(null);

  // INNER FUNCTIONS

  // HANDLERS
  const onFileLoaded = (target: FileReader) => {
    const blob = new Blob([target.result]);
    const _audioUrl = URL.createObjectURL(blob);

    setBlob(blob);
    setAudioUrl(_audioUrl);

    sendEvent(EVENTS.stop);
  };

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

  const onStart = async (): Promise<void> => {
    setCountdown(COUNTDOWN);
    setTimer(TIMER);

    try {
      sendEvent(EVENTS.start);

      recorder.current = await initRecorder();

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

    onRecorderClose();
  };

  const onTermsAndConditionsAccept = async (): Promise<void> => {
    sendEvent(EVENTS.accept);
    termsAndConditions.onAccept();
  };

  const onSampleRateSave = (): void => {
    closeSlider();

    log(`Pitch sample rate is saved. New value: ${currentSampleRate}`);
  };
  // HANDLERS ENDS

  useEffect(() => {
    if (termsAndConditions) {
      termsAndConditions.isAccepted().then((isAccepted) => {
        isAccepted || sendEvent(EVENTS.termsAndConditions);
      });
    }
  }, [termsAndConditions]);

  return (
    <RecorderContext.Provider
      value={{
        onDeletePronunciation: (): void =>
          onRecorderClose(RecorderCloseOptions.DELETE),
        handleOnRecorderClose: (): void =>
          onRecorderClose(RecorderCloseOptions.CANCEL),
        onDefaultSampleRateClick: useDefaultSampleRate,
        onUpdateSampleRate: setCurrentSampleRate,

        onTermsAndConditionsAccept,
        onSampleRateSave,
        onStart,
        onSave,
        onFileLoaded,
        onStop,

        saving,
        timer,
        countdown,
        audioUrl,
        displaySaving,
        termsAndConditions,
        currentStep,
        log,
        relativeSource,
        owner,
        pronunciation,
        closeSlider,
        slider,
        openSlider,
        currentSampleRate,

        deviceLabel,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorder = () => React.useContext(RecorderContext);
