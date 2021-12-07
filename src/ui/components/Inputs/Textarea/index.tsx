import React from "react";
import styles from "./styles.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
}

const Textarea = (props: Props) => {
  const nullCallback = (_) => false;

  return (
    <div className={styles.line}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      <span className={styles.input_wrapper}>
        <textarea
          id={props.id}
          onClick={nullCallback}
          value={props.value ? props.value : ""}
        />
      </span>
    </div>
  );
};

export default Textarea;
