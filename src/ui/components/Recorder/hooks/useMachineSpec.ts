import { useCallback, useRef, useState } from "react";
import { STATES } from "../machine/states";
import { Configuration } from "../types/configuration";

interface HookReturn {
  sendEvent: (event: any) => void;
  currentStep: React.MutableRefObject<STATES>;
}

const useMachineSpec = (configuration: Configuration): HookReturn => {
  const [step, setStep] = useState(configuration.initialState);

  const currentStep = useRef(step);

  currentStep.current = step;

  const sendEvent = useCallback(
    (event) => {
      const transition = configuration.transitions.find(
        (t) => t.name === event
      );

      if (!transition) throw new Error("Unknown event");

      if (
        transition.from.includes(currentStep.current) ||
        transition.from === "*"
      )
        return setStep(transition.to);

      throw new Error("Inconsistent state");
    },
    [configuration.transitions]
  );

  return { sendEvent, currentStep };
};

export default useMachineSpec;
