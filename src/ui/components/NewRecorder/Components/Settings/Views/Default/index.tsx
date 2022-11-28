import classNames from "classnames/bind";
import React from "react";
import { TOOLTIP_DELAY } from "../../../../../../../constants";
import generateTooltipId from "../../../../../../../core/utils/generate-tooltip-id";
import Tooltip from "../../../../../../kit/Tooltip";
import useTooltip from "../../../../../../kit/Tooltip/hooks/useTooltip";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({ active, onClick }: SettingsProps): JSX.Element => {
  const options = { onClick };
  const tooltipId = generateTooltipId("recorder_settings");
  const tooltip = useTooltip<HTMLDivElement>();

  return (
    <div>
      {/* TODO: Check if tooltip is needed here at all*/}
      <Tooltip
        id={tooltipId}
        //  delayHide={TOOLTIP_DELAY}
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
