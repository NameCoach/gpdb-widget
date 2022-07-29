import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  active?: boolean;
  className?: string;
}

const cx = classNames.bind(styles);

const ShareAction = (props: Props): JSX.Element => (
  <div
    className={cx(props.className, styles.wrapper, { active: props.active })}
  >
    <i className={cx("share-audio-url")} />
  </div>
);

export default ShareAction;
