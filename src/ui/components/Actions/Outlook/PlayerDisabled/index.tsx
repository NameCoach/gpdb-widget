import React from "react";
import Tooltip from "../../../Tooltip";
import IconButtons from "../../../../kit/IconButtons";

interface Props {
  className?: string;
  tooltipId?: string;
}

const PlayerDisabled = ({
  tooltipId = Date.now().toString(),
}: Props): JSX.Element => {
  return (
    <>
      <Tooltip id={tooltipId} place="top" effect="solid" />

      <IconButtons.SpeakerNoRecording
        data-tip="Pronunciations not available"
        data-for={tooltipId}
      />
    </>
  );
};

export default PlayerDisabled;
