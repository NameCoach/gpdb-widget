import React, { MouseEventHandler } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  active: boolean;
  onClick?: (val) => void;
}

const Settings = (props: Props) => (
  <div
    className={cx(styles.settings, { active: props.active })}
    onClick={props.onClick}
  />
);

export default Settings;
