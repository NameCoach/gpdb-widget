import React from "react";
import Tooltip from "../../../../kit/Tooltip";
import IconButtons from "../../../../kit/IconButtons";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useTranslator from "../../../../hooks/useTranslator";

const PLAY_TOOLTIP_SIDE_OFFSET = 2;
interface Props {
  className?: string;
  tooltipId?: string;
}

const PlayerDisabled = ({
  tooltipId = generateTooltipId("player_disabled"),
}: Props): JSX.Element => {
  const tooltip = useTooltip<HTMLButtonElement>();
  const { t } = useTranslator();

  return (
    <div>
      <Tooltip
        id={tooltipId}
        rightArrow
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
        arrowSideOffset={PLAY_TOOLTIP_SIDE_OFFSET}
      >
        {t("player_disabled_tooltip_text")}
      </Tooltip>

      <IconButtons.SpeakerNoRecording
        ref={tooltip.openerRef}
      />
    </div>
  );
};

export default PlayerDisabled;
