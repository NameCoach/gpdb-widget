import React, { MouseEventHandler } from "react";
import useTranslator from "../../../../hooks/useTranslator";
import IconButtons from "../../../../kit/IconButtons";
import Tooltip from "../../../../kit/Tooltip";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";

const TOOLTIP_SIDE_OFFSET = 2;

interface Props {
  rerecord?: boolean;
  onClick?: MouseEventHandler;
}

const RecordAction = ({ rerecord, onClick }: Props): JSX.Element => {
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLButtonElement>();
  
  const ButtonComponent = rerecord ? IconButtons.Edit : IconButtons.Microphone;
  const tooltipMessage = rerecord
    ? t("record_edit_my_recording")
    : t("record_create_new_recording");
   
  return (
    <div>
      <Tooltip opener={tooltip.opener} ref={tooltip.tooltipRef} rightArrow arrowSideOffset={TOOLTIP_SIDE_OFFSET}>
        {tooltipMessage}
      </Tooltip>
      <ButtonComponent onClick={onClick} ref={tooltip.openerRef}/>
    </div>
  );
};

export default RecordAction;
