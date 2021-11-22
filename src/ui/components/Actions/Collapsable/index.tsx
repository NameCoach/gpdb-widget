import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  active?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const CollapsableAction = (props: Props) => (
  <div
    className={cx(props.className, styles.wrapper, { active: props.active })}
    onClick={props.onClick}
  >
    {props.active ? <i className={styles.minus_icon} /> : <i className={styles.plus_icon} />}
  </div>
);

export default CollapsableAction;
