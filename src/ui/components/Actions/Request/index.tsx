import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import Tooltip from "../../../kit/Tooltip";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";
import useTranslator from "../../../hooks/useTranslator";

interface Props {
  disabled?: boolean;
  className?: string;
  tooltipId?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const RequestAction = ({
  disabled,
  className,
  tooltipId = generateTooltipId("request_action"),
  onClick,
}: Props): JSX.Element => {
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLDivElement>();

  return (
    <div>
      <Tooltip
        id={tooltipId}
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
        rightArrow
      >
        {t("request_recording_action_tooltip_text")}
      </Tooltip>

      <div
        className={cx(className, styles.wrapper, {
          disabled: disabled,
        })}
        onClick={onClick}
        ref={tooltip.openerRef}
      >
        <i className={styles.request_icon} />
      </div>
    </div>
  );
};

export default RequestAction;
