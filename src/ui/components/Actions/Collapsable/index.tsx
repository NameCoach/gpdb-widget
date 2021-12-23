import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  active?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
  effectsOff?: boolean;
}

const cx = classNames.bind(styles);

const CollapsableAction = (props: Props): JSX.Element => (
  <div
    className={cx(props.className, styles.wrapper, {
      active: props.effectsOff ? false : props.active,
    })}
    onClick={props.onClick}
  >
    {props.active ? (
      <i className={styles.minus_icon} />
    ) : (
      <i className={styles.plus_icon} />
    )}
  </div>
);

export default CollapsableAction;
