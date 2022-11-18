export const logRecordingDeviceInfo = async (
  stream: MediaStream,
  log: (message: string) => void
): Promise<void> => {
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

  Object.keys(recordingDeviceSettings).forEach((key) =>
    log(
      `Observed ${key} from media stream: ${
        recordingDeviceSettings[key] || "not detected"
      }`
    )
  );
};
