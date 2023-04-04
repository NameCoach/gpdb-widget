import React from "react";
import { DEFAULT_SAMPLE_RATE } from "../constants";
import { DeviceLabel } from "../types/device-label";
import { SampleRate } from "../types/sample-rate";

interface HookReturn {
  currentSampleRate: SampleRate;
  defaultSampleRate: SampleRate;
  setCurrentSampleRate: React.Dispatch<React.SetStateAction<SampleRate>>;
  useDefaultSampleRate: () => void;
  setDefaultSampleRate: React.Dispatch<React.SetStateAction<SampleRate>>;
  deviceLabel: DeviceLabel;
  setDeviceLabel: React.Dispatch<React.SetStateAction<DeviceLabel>>;
}

export const useSampleRate = (): HookReturn => {
  const [currentSampleRate, setCurrentSampleRate] = React.useState<SampleRate>(
    DEFAULT_SAMPLE_RATE
  );
  const [defaultSampleRate, setDefaultSampleRate] = React.useState<SampleRate>(
    DEFAULT_SAMPLE_RATE
  );
  const [deviceLabel, setDeviceLabel] = React.useState<DeviceLabel>(null);
  const useDefaultSampleRate = (): void =>
    setCurrentSampleRate(defaultSampleRate);

  return {
    currentSampleRate,
    setCurrentSampleRate,
    defaultSampleRate,
    useDefaultSampleRate,
    setDefaultSampleRate,
    deviceLabel,
    setDeviceLabel,
  };
};

export default useSampleRate;
