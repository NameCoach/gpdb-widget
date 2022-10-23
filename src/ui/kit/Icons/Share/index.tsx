import React from "react";
import { ReactComponent as Share } from "./share.svg";
import styles from "./styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ShareIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Share className={cx(styles.main, className)} style={style} />
);

export default ShareIcon;
