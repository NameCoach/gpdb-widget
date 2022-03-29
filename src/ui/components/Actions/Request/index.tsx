import React, { MouseEventHandler } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import ReactTooltip from "react-tooltip";
import { BRAND_COLOR, WHITE_COLOR } from "../../../../constants";

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
      <ReactTooltip
        id={tooltipId}
        textColor={WHITE_COLOR}
        backgroundColor={BRAND_COLOR}
        multiline
      />
      <i
        className={styles.request_icon}
        data-tip="Request recording"
        data-for={tooltipId}
      />
    </div>
  );
};

export default RequestAction;
