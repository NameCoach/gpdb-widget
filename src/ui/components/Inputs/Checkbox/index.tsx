import React from "react";
import styles from "./styles.module.css";

interface Props {
  id: string;
  label: string;
  value: boolean;
  disabled: boolean;
}

const Checkbox = (props: Props) => {
  const nullCallback = (_) => false;

  return (
    <div className={styles.line}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        type="checkbox"
        id={props.id}
        onClick={nullCallback}
        checked={props.value}
        disabled={props.disabled}
      />
    </div>
  );
};

export default Checkbox;
