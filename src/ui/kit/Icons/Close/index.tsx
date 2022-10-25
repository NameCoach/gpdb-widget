import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../types";
import { ReactComponent as Close } from "./close.svg";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const CloseIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Close className={cx(styles.main, className)} style={style} />
);

export default CloseIcon;
