import RecordRTC, { Options } from "../../../../recordrtc-fork/RecordRTC.js";
import { DeviceLabel } from "../types/device-label";
import { SampleRate } from "../types/sample-rate";

interface HookProps {
  log: (message: string) => void;
  desiredSampleRate: SampleRate;
  setDesiredSampleRate: (value: SampleRate) => void;
  defaultSampleRate: SampleRate;
  setDefaultSampleRate: (value: SampleRate) => void;
  setDeviceLabel?: (value: DeviceLabel) => void;
}

type HookReturn = () => Promise<RecordRTC>;

const useRecordRTC = ({
  log,
  desiredSampleRate,
  setDesiredSampleRate,
  defaultSampleRate,
  setDefaultSampleRate,
  setDeviceLabel,
}: HookProps): HookReturn => {
  const logRecordingDeviceInfo = async (stream: MediaStream): Promise<void> => {
    const audioTracks = stream?.getAudioTracks();
    if (audioTracks.length === 0) return log("Stream has no media tracks");

    const recordingDeviceSettings = audioTracks[0]?.getSettings();
    if (!recordingDeviceSettings)
      return log("Stream aduio track does not nave settings");

    const devices = await navigator.mediaDevices.enumerateDevices();
    const recordingDeviceInfo = devices.find(
      (element) => element.deviceId === recordingDeviceSettings.deviceId
    );

    log(`Recording device label: ${recordingDeviceInfo.label}`);
    if (recordingDeviceInfo && setDeviceLabel)
      setDeviceLabel(recordingDeviceInfo?.label);

    Object.keys(recordingDeviceSettings).forEach((key) =>
      log(
        `Observed ${key} from media stream: ${
          recordingDeviceSettings[key] || "not detected"
        }`
      )
    );
  };

  const initRecorder = async (): Promise<RecordRTC> => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    const audioCtxSampleRate = audioCtx.sampleRate;

    log(`BaseAudioContext.sampleRate: ${audioCtxSampleRate}`);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    await logRecordingDeviceInfo(stream);

    log(`gpdb-widget pitch current sample rate: ${desiredSampleRate}`);

    let _desiredSampleRate = desiredSampleRate;

    if (defaultSampleRate !== audioCtxSampleRate) {
      setDefaultSampleRate(audioCtxSampleRate);
      log(`AudioContext sample rate will be used as Default sample rate`);
      setDesiredSampleRate(audioCtxSampleRate);
      _desiredSampleRate = audioCtxSampleRate;
      log(`audio context sample rate is used as current pitch value`);
    }

    const options = {
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: "audio/wav",
      noWorker: true,
      desiredSampRate: _desiredSampleRate,
    } as Options;

    return new RecordRTC(stream, options);
  };

  return initRecorder;
};

export default useRecordRTC;
