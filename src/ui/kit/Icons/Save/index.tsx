import React from "react";
import { ReactComponent as Save } from "./save.svg";
import styles from "./styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SaveIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Save className={cx(styles.main, className)} style={style} />
);

export default SaveIcon;
