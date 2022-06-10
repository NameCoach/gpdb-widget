import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Tooltip from "../../Tooltip";
import { TOOLTIP_DELAY } from "../../../../constants";

const cx = classNames.bind(styles);

interface SampleRates {
  value: number;
  minValue: number;
  maxValue: number;
}

interface Props {
  active: boolean;
  onClick?: (val) => void;
  sampleRates?: SampleRates;
}

const Settings = ({ active, onClick, sampleRates }: Props): JSX.Element => {
  const tooltipId = Date.now().toString();

  const options = onClick
    ? { onClick }
    : {
        "data-for": tooltipId,
        "data-tip": `Observed sample rate from media stream(${sampleRates.value}) is out of allowed ranges [${sampleRates.minValue}, ${sampleRates.maxValue}]. Settings are not accessible`,
        "data-event": "click",
        "data-event-off": "mouseout",
      };

  return (
    <>
      <div className={cx(styles.settings, { active: active })} {...options} />
      <Tooltip id={tooltipId} delayHide={TOOLTIP_DELAY} />
    </>
  );
};

export default Settings;
