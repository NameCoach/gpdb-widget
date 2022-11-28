import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

export interface LinkProps {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => any;
};

const Link = ({ children, href, onClick }: LinkProps):JSX.Element => {
  return <div className={cx(styles.container)}>
    <a className={cx(styles.link)} href={href} onClick={onClick}>
      {children}
    </a>
  </div>;
};

export default Link;
