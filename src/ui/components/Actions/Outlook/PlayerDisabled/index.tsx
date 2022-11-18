import React from "react";
import Tooltip from "../../../Tooltip";
import IconButtons from "../../../../kit/IconButtons";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

interface Props {
  className?: string;
  tooltipId?: string;
}

const PlayerDisabled = ({
  tooltipId = generateTooltipId("player_disabled"),
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
