import classNames from "classnames/bind";
import React from "react";
import styles from "../styles.module.css";
import ReactTooltip from "react-tooltip";

const cx = classNames.bind(styles);

const DisabledPlayer = (): JSX.Element => {
  const tooltipId = Date.now().toString();

  return (
    <div
      aria-label="Disabled player"
      className={cx(styles.player, "test", "player", "unavailable__disabled")}
    >
      <ReactTooltip
        id={tooltipId}
        textColor="white"
        backgroundColor="#946cc1"
        multiline
      />
      <i
        className={cx(styles.speakerUnavailable, "speaker-unavailable")}
        data-tip="Pronunciations not available"
        data-for={tooltipId}
        data-tip-disable={false}
      />
    </div>
  );
};

export default DisabledPlayer;
