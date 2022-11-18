import classNames from "classnames/bind";
import React from "react";
import { CheckBoxIconProps, IconBasicProps } from "../types";
import { ReactComponent as Checked } from "./checked.svg";
import { ReactComponent as Unchecked } from "./unchecked.svg";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const CheckBoxIcon = ({
  style,
  className,
  checked,
  error,
}: CheckBoxIconProps): React.ReactElement<IconBasicProps> => {
  return checked ? (
    <Checked
      className={cx(styles.square_20, styles.checked, className)}
      style={style}
    />
  ) : (
    <Unchecked
      className={cx(styles.square_20, styles.unchecked, className, {
        error: error,
      })}
      style={style}
    />
  );
};

export default CheckBoxIcon;
