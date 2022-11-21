import React from "react";
import { ReactComponent as ShevronDown } from "./shevron-down.svg";
import { ShevronIconProps } from "../types";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);
const ShevronIcon = ({
  style,
  className,
  up,
}: ShevronIconProps): React.ReactElement<ShevronIconProps> => (
  <ShevronDown className={cx(styles.main, className, { up })} style={style} />
);

export default ShevronIcon;
