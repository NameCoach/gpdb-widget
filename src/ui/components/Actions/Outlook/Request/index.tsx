import React, { MouseEventHandler } from "react";
import Tooltip from "../../../../kit/Tooltip";
import IconButtons from "../../../../kit/IconButtons";
import useTranslator from "../../../../hooks/useTranslator";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";

interface Props {
  disabled?: boolean;
  tooltipId?: string;
  onClick?: MouseEventHandler;
}

const RequestAction = ({
  tooltipId = generateTooltipId("request_action"),
  disabled,
  onClick,
}: Props): JSX.Element => {
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLButtonElement>();

  return (
    <div>
      <Tooltip
        id={tooltipId}
        opener={tooltip.opener}
        rightArrow
        ref={tooltip.tooltipRef}
      >
        {t("tooltip_request_recording_tip")}
      </Tooltip>

      <IconButtons.Request
        ref={tooltip.openerRef}
        disabled={disabled}
        onClick={onClick}
      />
    </div>
  );
};

export default RequestAction;
