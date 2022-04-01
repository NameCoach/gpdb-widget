import classNames from "classnames/bind";
import React from "react";
import styles from "../styles.module.css";
import ReactTooltip from "react-tooltip";
import { BRAND_COLOR, WHITE_COLOR } from "../../../../constants";

const cx = classNames.bind(styles);

interface Props {
  className?: string;
}

const DisabledPlayer = (props: Props): JSX.Element => {
  const tooltipId = Date.now().toString();

  return (
    <div
      aria-label="Disabled player"
      className={cx(
        props.className,
        styles.player,
        "player",
        "unavailable__disabled"
      )}
    >
      <ReactTooltip
        id={tooltipId}
        textColor={WHITE_COLOR}
        backgroundColor={BRAND_COLOR}
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
