import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  active?: boolean;
  rerecord?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const RecordAction = (props: Props): JSX.Element => (
  <div
    className={cx(props.className, styles.wrapper, { active: props.active })}
    onClick={props.onClick}
  >
    <i
      className={props.rerecord ? styles.mic_rerecord_icon : styles.mic_icon}
    />
  </div>
);

export default RecordAction;
