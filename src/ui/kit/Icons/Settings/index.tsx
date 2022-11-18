import React from "react";
import { ReactComponent as Settings } from "./settings.svg";
import styles from "./styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SettingsIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Settings className={cx(styles.main, className)} style={style} />
);

export default SettingsIcon;
