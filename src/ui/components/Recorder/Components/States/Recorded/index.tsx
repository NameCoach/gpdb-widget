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

const RecordedState = (): JSX.Element => {
  const { theme } = useTheme();

  const { slider, openSlider, closeSlider } = useRecorder();

  const { handleOnRecorderClose, onStart, onSave } = useRecorder();

  const { audioUrl } = useRecorder();

  const {
    currentSampleRate: sampleRate,
    onDefaultSampleRateClick,
    onUpdateSampleRate,
    onSampleRateSave,
    deviceLabel,
  } = useRecorder();

  return (
    <>
      {views[theme]({
        slider,
        openSlider,
        closeSlider,

        onDefaultSampleRateClick,
        onUpdateSampleRate,
        onSampleRateSave,

        sampleRate,

        audioUrl,
        handleOnRecorderClose,

        onSave,
        onStart,

        deviceLabel,
      })}
    </>
  );
};

export default RecordedState;
