import React, { memo, useRef, useState } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { CustomAttributesInputsProps } from "../types";

const cx = classNames.bind(styles);

const Checkbox = ({
  id,
  value,
  label,
  disabled,
  onUpdate,
}: CustomAttributesInputsProps): JSX.Element => {
  return (
    <div className={cx(styles.checkbox_container, styles.row)}>
      <div className={cx(styles.row)}>
        <label className={cx(styles.label)} htmlFor={id}>
          {label}
        </label>
      </div>
      <div className={styles.row}>
        <button 
          className={styles.icon_btn}
          onClick={() => onUpdate(!value)}
          disabled={disabled}
        >
          {!!value ? (
            <i className={cx(styles.checked_icon)} />
          ) : (
            <i className={cx(styles.empty_icon)} />
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(Checkbox);
