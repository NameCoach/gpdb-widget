import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../types";
import { ReactComponent as Help } from "./help.svg";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const HelpIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Help className={cx(styles.main, className)} style={style} />
);

export default HelpIcon;
