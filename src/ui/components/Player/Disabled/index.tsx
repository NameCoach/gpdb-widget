import classNames from "classnames/bind";
import React from "react";
import styles from "../styles.module.css";

const cx = classNames.bind(styles);

const DisabledPlayer = (): JSX.Element => (
  <div
    aria-label="Disabled player"
    className={cx(styles.player, "test", {
      player__disabled: true,
    })}
  >
    <i className={styles.speaker} />
  </div>
);

export default DisabledPlayer;
