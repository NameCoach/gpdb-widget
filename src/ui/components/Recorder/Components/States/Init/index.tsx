import React, { useContext } from "react";
import { Theme } from "../../../../../../types/style-context";
import ControllerContext from "../../../../../contexts/controller";
import useCustomFeatures from "../../../../../hooks/useCustomFeatures";
import useFeaturesManager from "../../../../../hooks/useFeaturesManager";
import { useRecorder } from "../../../hooks/useRecorder";
import useTheme from "../../../../../hooks/useTheme";
import { ViewProps } from "./types";
import OutlookView from "./Views/Outlook";

const views = {
  [Theme.Outlook]: (props: ViewProps): JSX.Element => (
    <OutlookView {...props} />
  ),
  [Theme.Default]: (props: ViewProps): JSX.Element => (
    <OutlookView {...props} />
  ),
};

const InitState = (): JSX.Element => {
  const controller = useContext(ControllerContext);
  const customFeatures = useCustomFeatures(controller);

  const {
    onStart,
    onDeletePronunciation,
    handleOnRecorderClose,

    pronunciation,
    owner,
  } = useRecorder();

  const { can, show } = useFeaturesManager(
    controller.permissions,
    customFeatures
  );

  const showRecordButton = show(
    "recorderRecordButton",
    pronunciation,
    owner?.signature
  );

  const showDeleteButton = can("destroyPronunciation", pronunciation);

  const { theme } = useTheme();

  return (
    <>
      {views[theme]({
        pronunciation,
        showDeleteButton,
        showRecordButton,
        onStart,
        handleOnRecorderClose,
        onDeletePronunciation,
      })}
    </>
  );
};

export default InitState;
