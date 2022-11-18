import classNames from "classnames/bind";
import React from "react";
import { TOOLTIP_DELAY } from "../../../../../../../constants";
import generateTooltipId from "../../../../../../../core/utils/generate-tooltip-id";
import Tooltip from "../../../../../Tooltip";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({
  active,
  onClick,
  tooltipId = generateTooltipId("recorder_settings"),
}: SettingsProps): JSX.Element => {
  const options = { onClick };

  return (
    <>
      <div className={cx(styles.settings, { active: active })} {...options} />
      <Tooltip id={tooltipId} delayHide={TOOLTIP_DELAY} />
    </>
  );
};

export default DefaultView;
