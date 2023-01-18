import React from "react";
import { ReactComponent as SaveWithChanges } from "./save.svg";
import styles from "./styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SaveWithChangesIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <SaveWithChanges className={cx(styles.main, className)} style={style} />
);

export default SaveWithChangesIcon;
