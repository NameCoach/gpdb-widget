import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../types";
import styles from "./styles.module.css";
import { ReactComponent as CloseTooltip } from "./close_tooltip.svg";

const cx = classNames.bind(styles);

const CloseTooltipIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <CloseTooltip className={cx(styles.main, className)} style={style} />
);

export default CloseTooltipIcon;
