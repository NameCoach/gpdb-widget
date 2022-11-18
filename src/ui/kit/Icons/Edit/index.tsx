import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../types";
import { ReactComponent as Edit } from "./edit.svg";
import styles from "../styles.module.css";

const cx = classNames.bind(styles);

const EditIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Edit className={cx(styles.main, className)} style={style} />
);

export default EditIcon;
