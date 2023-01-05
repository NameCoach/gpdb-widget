import React, { memo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { CustomAttributesInputsProps } from "../types";
import IconButtons from "../../../../kit/IconButtons";

const cx = classNames.bind(styles);

const Checkbox = ({
  id,
  value,
  label,
  disabled,
  onChange,
  isChild,
}: CustomAttributesInputsProps): JSX.Element => {
  const onClick = (): void => onChange(id, !value);

  return (
    <div className={cx(styles.checkbox_container, styles.row, { isChild })}>
      <div className={cx(styles.row)}>
        <label className={cx(styles.label, { isChild })} htmlFor={id}>
          {label}
        </label>
      </div>
      <div className={cx(styles.row, styles.justify_right)}>
        <IconButtons.Checkbox
          iconOptions={{ checked: !!value }}
          onClick={onClick}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default memo(Checkbox);
