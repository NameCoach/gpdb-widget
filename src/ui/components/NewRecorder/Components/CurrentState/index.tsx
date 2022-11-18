import React from "react";
import { useRecorder } from "../../hooks/useRecorder";
import STATES_COMPONENTS from "../../machine/states-components";

const CurrentState = (): JSX.Element => {
  const { currentStep } = useRecorder();

  return <>{STATES_COMPONENTS[currentStep.current]()}</>;
};

export default CurrentState;
