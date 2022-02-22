import React, { memo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

interface Props {
  id: string;
  label: string;
  value: boolean;
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
  const nullCallback = (_): null => null;

  const onChange = (_): void => {
    if (onUpdate) onUpdate({ id, value: !value });
  };
  return (
    <div className={cx("line-wrapper", { disabled })}>
      <label className={cx("label-wrapper", { disabled })} htmlFor={id}>
        {label}
      </label>
      <span className={styles.checkbox_wrapper}>
        <input
          type="checkbox"
          id={id}
          onClick={onChange}
          onChange={nullCallback}
          checked={!!value}
          disabled={disabled}
        />
      </span>
    </div>
  );
};

export default memo(Checkbox);
