import React from "react";
import { Theme } from "../../../../../../types/style-context";
import { useRecorder } from "../../../hooks/useRecorder";
import useTheme from "../../../../../hooks/useTheme";
import { StateProps } from "./types";
import OutlookView from "./Views/Outlook";

const views = {
  [Theme.Outlook]: (props: StateProps): JSX.Element => (
    <OutlookView {...props} />
  ),
  [Theme.Default]: (props: StateProps): JSX.Element => (
    <OutlookView {...props} />
  ),
};

const StartedState = (): JSX.Element => {
  const { theme } = useTheme();

  const { handleOnRecorderClose, countdown } = useRecorder();

  return <>{views[theme]({ handleOnRecorderClose, countdown })}</>;
};

export default StartedState;
