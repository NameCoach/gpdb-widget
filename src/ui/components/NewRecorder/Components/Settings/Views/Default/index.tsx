import classNames from "classnames/bind";
import React from "react";
import { TOOLTIP_DELAY } from "../../../../../../../constants";
import Tooltip from "../../../../../Tooltip";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({ active, onClick }: SettingsProps): JSX.Element => {
  const options = { onClick };
  const tooltipId = Date.now().toString();

  return (
    <>
      <div className={cx(styles.settings, { active: active })} {...options} />
      <Tooltip id={tooltipId} delayHide={TOOLTIP_DELAY} />
    </>
  );
};

export default DefaultView;
