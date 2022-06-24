import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Tooltip from "../../Tooltip";
import { TOOLTIP_DELAY } from "../../../../constants";

const cx = classNames.bind(styles);
interface Props {
  active: boolean;
  onClick: (val) => void;
}

const Settings = ({ active, onClick }: Props): JSX.Element => {
  const tooltipId = Date.now().toString();

  const options = { onClick };

  return (
    <>
      <div className={cx(styles.settings, { active: active })} {...options} />
      <Tooltip id={tooltipId} delayHide={TOOLTIP_DELAY} />
    </>
  );
};

export default Settings;
