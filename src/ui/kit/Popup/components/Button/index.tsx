import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => any;
  style?: React.CSSProperties;
};

const Button = ({ children, onClick, style}: ButtonProps): JSX.Element => {
  return <div className={cx(styles.container)}>
    <button className={cx(styles.button)} style={style} onClick={onClick}>
      {children}
    </button>
  </div>;
};

export default Button;
