import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

interface Props {
  inline?: boolean;
  sm?: boolean;
  btn?: boolean;
}

const cx = classNames.bind(styles);

const Loader = (props: Props) => (
  <div>
    <div
      className={cx(styles.loader, {
        loader__inline: props.inline,
        loader__sm: props.sm,
        loader__btn: props.btn,
      })}
    />
  </div>
);

export default Loader;
