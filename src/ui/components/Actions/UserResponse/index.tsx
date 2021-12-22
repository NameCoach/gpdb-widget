import React, { MouseEventHandler } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

interface Props {
  active?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const UserResponseAction = (props: Props) => (
  <div
    className={cx(props.className, styles.wrapper, { active: props.active })}
    onClick={props.onClick}
  >
    <i
      className={
        props.active ? styles.bookmark_active_icon : styles.bookmark_icon
      }
    />
  </div>
);

export default UserResponseAction;
