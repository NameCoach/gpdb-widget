import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

export interface TextProps {
  children?: React.ReactNode;
}

const Text = ({children}: TextProps) => {
  return <div className={cx(styles.container)}>
    <p className={cx(styles.text)}> { children } </p>
  </div>;
}

export default Text;
