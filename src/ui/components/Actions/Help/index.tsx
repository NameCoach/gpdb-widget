import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  active?: boolean;
  className?: string;
}

const cx = classNames.bind(styles);

const HelpAction = ({ active, className }: Props): JSX.Element => (
  <div className={cx(className, styles.wrapper, { active: active })}>
    <i className={cx("tooltip")} />
  </div>
);

export default HelpAction;
