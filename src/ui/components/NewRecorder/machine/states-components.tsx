import React from "react";
import CustomAttributesState from "../Components/States/CustomAttributes";
import FailedState from "../Components/States/Failed";
import InitState from "../Components/States/Init";
import RecordState from "../Components/States/Record";
import RecordedState from "../Components/States/Recorded";
import SavedState from "../Components/States/Saved";
import StartedState from "../Components/States/Started";
import { STATES } from "./states";

const STATES_COMPONENTS = {
  [STATES.INIT]: (props): JSX.Element => <InitState {...props} />,
  [STATES.STARTED]: (props): JSX.Element => <StartedState {...props} />,
  [STATES.RECORD]: (props): JSX.Element => <RecordState {...props} />,
  [STATES.RECORDED]: (props): JSX.Element => <RecordedState {...props} />,
  [STATES.SAVED]: (props): JSX.Element => <SavedState {...props} />,
  [STATES.FAILED]: (props): JSX.Element => <FailedState {...props} />,
  [STATES.CUSTOM_ATTRS]: (props): JSX.Element => (
    <CustomAttributesState {...props} />
  ),
};

export default STATES_COMPONENTS;
