import React, { MouseEventHandler } from "react";
import Tooltip from "../../../Tooltip";
import IconButtons from "../../../../kit/IconButtons";
import useTranslator from "../../../../hooks/useTranslator";

interface Props {
  disabled?: boolean;
  tooltipId?: string;
  onClick?: MouseEventHandler;
}

const RequestAction = ({
  tooltipId = Date.now().toString() + RequestAction.name,
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
