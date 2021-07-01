import React, { useRef, useContext, useState, useCallback } from "react";
import RecordRTC from "recordrtc";
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
  onRecorderClose: () => void;
}

const machineSpec = {
  initialState: STATES.INIT,
  transitions: [
    {
      name: "start",
      from: [STATES.INIT, STATES.RECORDED],
      to: STATES.STARTED,
    },
    { name: "ready", from: STATES.STARTED, to: STATES.RECORD },
    { name: "stop", from: STATES.RECORD, to: STATES.RECORDED },
    { name: "save", from: STATES.RECORDED, to: STATES.SAVED },
    { name: "fail", from: STATES.ALL, to: STATES.FAILED },
  ],
};

export const EVENTS = {
  start: "start",
  ready: "ready",
  stop: "stop",
  save: "save",
  fail: "fail",
};

const Recorder = ({ onRecorderClose, name, type }: Props) => {
  const [step, setStep] = useState(machineSpec.initialState);
  const [timer, setTimer] = useState(TIMER);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN);
  const [blob, setBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [slider, openSlider, closeSlider] = useSliderState();
  const [timeoutId, setTimeoutId] = useState(null);
  const controller = useContext(ControllerContext);
  const currentStep = useRef(step);
  const recorder = useRef(null);

  const [sampleRate, setSampleRate] = useState<{ value: number }>({
    value: DEFAULT_SAMPLE_RATE,
  });

  currentStep.current = step;

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

  const onStop = async () => {
    const stopRecording = () =>
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

  const onReady = async () => {
    sendEvent(EVENTS.ready);

    if (timeoutId) clearTimeout(timeoutId);

    const delayTimer = () => {
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

  const onStart = async () => {
    setCountdown(COUNTDOWN);
    setTimer(TIMER);
    try {
      sendEvent(EVENTS.start);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new RecordRTC(stream, {
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: "audio/wav",
        sampleRate: sampleRate.value,
      });

      Array.from({ length: COUNTDOWN }, (_, index) => {
        const st = index + 1;

        setTimeout(() => {
          setCountdown((countdown) => --countdown);
          if (st === COUNTDOWN) onReady();
        }, st * 950);
      });
    } catch {
      setTimeout(() => sendEvent(EVENTS.fail), 0);
    }
  };

  const onSave = async () => {
    sendEvent(EVENTS.save);
    const str = await blobToBase64String(blob);

    await controller.createRecording(name, type, str);

    setTimeout(onRecorderClose, ONE_SECOND * 2);
  };

  const onSampleRateSave = () => {
    closeSlider();
    controller.saveAudioSampleRate(sampleRate.value);
  };

  const updateSampleRate = (val) => setSampleRate({ value: val });

  return (
    <div className={styles.recorder}>
      {[STATES.STARTED, STATES.RECORD, STATES.FAILED].includes(step) && (
        <Close onClick={onRecorderClose} />
      )}
      {step === STATES.SAVED && <Loader inline />}
      <div className={styles.recorder__body}>
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
            <Settings onClick={openSlider} active={slider} />
          </div>
        )}

        {step === STATES.FAILED && (
          <span>Allow microphone and try again, please.</span>
        )}
      </div>
      <div className={styles.recorder__actions}>
        {step === STATES.INIT && (
          <>
            <button onClick={onRecorderClose}>BACK</button>
            <button onClick={onStart}>START</button>
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
            />
            <button onClick={closeSlider} className={styles.secondary}>
              BACK
            </button>
            <button onClick={onSampleRateSave}>SAVE</button>
          </>
        )}
        {step === STATES.RECORDED && !slider && (
          <>
            <button className={styles.no__border} onClick={onRecorderClose}>
              CLOSE
            </button>
            <button onClick={onStart}>RERECORD</button>
            <button onClick={onSave}>SAVE</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Recorder;
