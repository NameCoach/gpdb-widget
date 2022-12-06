import classNames from "classnames/bind";
import React from "react";
import styles from "../styles.module.css";
import Tooltip from "../../../kit/Tooltip";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";
import useTranslator from "../../../hooks/useTranslator";
import useTooltip from "../../../kit/Tooltip/hooks/useTooltip";

const cx = classNames.bind(styles);

interface Props {
  className?: string;
  tooltipId?: string;
}

const DisabledPlayer = ({
  className,
  tooltipId = generateTooltipId("disabled_player"),
}: Props): JSX.Element => {
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLDivElement>();

  return (
    <div>
      <Tooltip
        id={tooltipId}
        rightArrow
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
      >
        {t("player_disabled_tooltip_text")}
      </Tooltip>
      <div
        aria-label="Disabled player"
        className={cx(className, "disabled_player", "unavailable__disabled")}
        ref={tooltip.openerRef}
      >
        <i className={cx(styles.speakerUnavailable, "speaker-unavailable")} />
      </div>
    </div>
  );
};

export default DisabledPlayer;
