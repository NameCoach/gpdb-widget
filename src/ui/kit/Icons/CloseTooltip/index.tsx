import classNames from "classnames/bind";
import React from "react";
import CloseIcon from "../Close";
import { IconBasicProps } from "../types";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const CloseTooltipIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <CloseIcon style={style} className={cx(styles.main, className)} />
);

export default CloseTooltipIcon;
