import React, { MouseEventHandler } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  onClick?: MouseEventHandler;
  className?: string;
}

const Close = (props: Props) => (
  <div className={cx(styles.close, props.className)} onClick={props.onClick} />
);

export default Close;
