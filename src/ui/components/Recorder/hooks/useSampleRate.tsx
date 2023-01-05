import React from "react";
import { DEFAULT_SAMPLE_RATE } from "../constants";
import { SampleRate } from "../types/sample-rate";

interface HookReturn {
  currentSampleRate: SampleRate;
  defaultSampleRate: SampleRate;
  setCurrentSampleRate: React.Dispatch<React.SetStateAction<SampleRate>>;
  useDefaultSampleRate: () => void;
  setDefaultSampleRate: React.Dispatch<React.SetStateAction<SampleRate>>;
}

export const useSampleRate = (): HookReturn => {
  const [currentSampleRate, setCurrentSampleRate] = React.useState<SampleRate>(
    DEFAULT_SAMPLE_RATE
  );
  const [defaultSampleRate, setDefaultSampleRate] = React.useState<SampleRate>(
    DEFAULT_SAMPLE_RATE
  );

  const useDefaultSampleRate = (): void =>
    setCurrentSampleRate(defaultSampleRate);

  return {
    currentSampleRate,
    setCurrentSampleRate,
    defaultSampleRate,
    useDefaultSampleRate,
    setDefaultSampleRate,
  };
};

export default useSampleRate;
