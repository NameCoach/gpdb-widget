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
      <div className={cx("label-wrapper", { disabled })}>
        <label htmlFor={id}>{label}</label>
      </div>
      <div className={cx(styles.checkbox_wrapper, { disabled })}>
        <input
          type="checkbox"
          id={id}
          onClick={onChange}
          onChange={nullCallback}
          checked={!!value}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default memo(Checkbox);
