import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const RequestAction = (props: Props) => (
  <div
    className={cx(props.className, styles.wrapper, {
      disabled: props.disabled,
    })}
    onClick={props.onClick}
  >
    <i className={styles.request_icon} />
  </div>
);

export default RequestAction;
