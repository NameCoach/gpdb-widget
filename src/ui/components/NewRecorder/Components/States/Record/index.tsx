import React from "react";
import { Theme } from "../../../../../../types/style-context";
import { useRecorder } from "../../../hooks/useRecorder";
import useTheme from "../../../../../hooks/useTheme";
import { StateProps } from "./types";
import DefaultView from "./Views/Default";
import OutlookView from "./Views/Outlook";

const views = {
  [Theme.Outlook]: (props: StateProps): JSX.Element => (
    <OutlookView {...props} />
  ),
  [Theme.Default]: (props: StateProps): JSX.Element => (
    <DefaultView {...props} />
  ),
};

const RecordState = (): JSX.Element => {
  const { theme } = useTheme();

  const { handleOnRecorderClose, timer, onStop } = useRecorder();

  return <>{views[theme]({ handleOnRecorderClose, timer, onStop })}</>;
};

export default RecordState;
