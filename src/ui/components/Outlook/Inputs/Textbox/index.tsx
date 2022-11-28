import React, { memo } from "react";
import { CustomAttributesInputsProps } from "../types";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Textbox = ({
  id,
  value,
  label,
  disabled,
  metadata,
  onChange,
  hasErrors,
}: CustomAttributesInputsProps): JSX.Element => {
  const onInputChange = ({ target: { value } }): void => onChange(id, value);

  return (
    <div className={cx(styles.textbox_container, styles.column)}>
      <div className={cx(styles.row)}>
        <div className={cx(styles.label_container)}>
          <p className={cx(styles.label)}>{label}</p>
        </div>
      </div>
      <div className={cx(styles.row)}>
        <input
          id={id}
          onChange={onInputChange}
          className={cx(styles.input, { has_errors: hasErrors })}
          name={label}
          placeholder={metadata?.placeholder}
          value={String(value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default memo(Textbox);
