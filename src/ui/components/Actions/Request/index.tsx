import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import Tooltip from "../../Tooltip";
import generateTooltipId from "../../../../core/utils/generate-tooltip-id";

interface Props {
  disabled?: boolean;
  className?: string;
  tooltipId?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const RequestAction = ({
  disabled,
  className,
  tooltipId = generateTooltipId("request_action"),
  onClick,
}: Props): JSX.Element => {
  return (
    <div
      className={cx(className, styles.wrapper, {
        disabled: disabled,
      })}
      onClick={onClick}
    >
      <Tooltip id={tooltipId} />
      <i
        className={styles.request_icon}
        data-tip="Request recording"
        data-for={tooltipId}
      />
    </div>
  );
};

export default RequestAction;
