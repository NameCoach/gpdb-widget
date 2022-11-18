import React from "react";
import { ReactComponent as Request } from "./request.svg";
import styles from "./styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const RequestIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Request className={cx(styles.main, className)} style={style} />
);

export default RequestIcon;
