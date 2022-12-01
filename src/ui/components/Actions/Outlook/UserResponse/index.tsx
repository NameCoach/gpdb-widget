import React, { MouseEventHandler } from "react";
import useTranslator from "../../../../hooks/useTranslator";
import IconButtons from "../../../../kit/IconButtons";
import Tooltip from "../../../../kit/Tooltip";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";

interface Props {
  saved: boolean;
  onClick: MouseEventHandler;
}

const UserResponseAction = ({ saved, onClick }: Props): JSX.Element => {
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLButtonElement>();
  const tooltipMessage = saved
    ? t("user_response_bookmark_recording_saved")
    : t("user_response_bookmark_recording");
  
  return <div>
    <Tooltip opener={tooltip.opener} ref={tooltip.tooltipRef} rightArrow>
      {tooltipMessage}
    </Tooltip>
    <IconButtons.Bookmark iconOptions={{ saved }} onClick={onClick} ref={tooltip.openerRef}/>
  </div>
};

export default UserResponseAction;
