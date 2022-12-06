import classNames from "classnames/bind";
import React from "react";
import generateTooltipId from "../../../../../../../core/utils/generate-tooltip-id";
import useTooltip from "../../../../../../kit/Tooltip/hooks/useTooltip";
import Tooltip from "../../../../../../kit/Tooltip";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({
  active,
  onClick,
  tooltipId = generateTooltipId("recorder_settings"),
}: SettingsProps): JSX.Element => {
  const options = { onClick };
  const tooltip = useTooltip<HTMLDivElement>();

  return (
    // TODO: Check if tooltip is needed here. Check if this componen is needed.
    <div>
      <Tooltip
        // delayHide={TOOLTIP_DELAY}
        id={tooltipId}
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
      />
      <div
        ref={tooltip.openerRef}
        className={cx(styles.settings, { active: active })}
        {...options}
      />
    </div>
  );
};

export default DefaultView;
