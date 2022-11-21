import React, { MouseEventHandler } from "react";
import Tooltip from "../../../Tooltip";
import IconButtons from "../../../../kit/IconButtons";
import useTranslator from "../../../../hooks/useTranslator";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

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

  return (
    <>
      <Tooltip id={tooltipId} />
      <IconButtons.Request
        disabled={disabled}
        onClick={onClick}
        data-tip={t("tooltip_request_recording_tip")}
        data-for={tooltipId}
      />
    </>
  );
};

export default RequestAction;