import classNames from "classnames/bind";
import React from "react";
import styles from "../styles.module.css";
import Tooltip from "../../Tooltip";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";

const cx = classNames.bind(styles);

interface Props {
  className?: string;
  tooltipId?: string;
}

const DisabledPlayer = ({
  className,
  tooltipId = generateTooltipId("disabled_player"),
}: Props): JSX.Element => {
  return (
    <>
      <Tooltip
        className={styles.tooltip}
        id={tooltipId}
        place="top"
        effect="solid"
      />
      <div
        aria-label="Disabled player"
        className={cx(className, "disabled_player", "unavailable__disabled")}
      >
        <i
          className={cx(styles.speakerUnavailable, "speaker-unavailable")}
          data-tip="Pronunciations not available"
          data-for={tooltipId}
          data-tip-disable={false}
        />
      </div>
    </>
  );
};

export default DisabledPlayer;
