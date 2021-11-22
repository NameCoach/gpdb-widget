import React from "react";
import styles from "./styles.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
}

const InputLine = (props: Props) => {
  const nullCallback = (_) => false;

  return (
    <div className={styles.line}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        type="text"
        id={props.id}
        onClick={nullCallback}
        value={props.value ? props.value : ""}
        disabled={props.disabled}
      />
    </div>
  );
};

export default InputLine;
