import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import Tooltip from "../../Tooltip";

interface Props {
  disabled?: boolean;
  className?: string;
  tooltipId?: string;
  onClick?: MouseEventHandler;
}

const cx = classNames.bind(styles);

const RequestAction = (props: Props): JSX.Element => {
  const tooltipId = props.tooltipId || Date.now().toString();

  return (
    <div
      className={cx(props.className, styles.wrapper, {
        disabled: props.disabled,
      })}
      onClick={props.onClick}
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
