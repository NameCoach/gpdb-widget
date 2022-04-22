import React, { memo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

interface Props {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onUpdate?: (any) => void;
}

const cx = classNames.bind(styles);

const Checkbox = ({
  id,
  value,
  label,
  disabled,
  onUpdate,
}: Props): JSX.Element => {
  const onChange = (e): void => {
    if (onUpdate) {
      const value = e.target.checked;

      onUpdate({ id, value });
    }
  };

  return (
    <div className={styles.checkbox_field}>
      <div className={cx(styles.attributes_label, { disabled })}>{label}</div>
      <div className={styles.checkbox_input_field}>
        <input
          type="checkbox"
          id={id}
          onChange={onChange}
          name={label}
          placeholder={label}
          checked={!!value}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default memo(Checkbox);
