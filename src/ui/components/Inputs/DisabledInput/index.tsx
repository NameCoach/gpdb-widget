import React from "react";
import styles from "./styles.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
}

const DisabledInput = (props: Props) => {
  return (
    <div className={styles.line}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.input_wrapper}>
        {props.value ? props.value : ""}
      </div>
    </div>
  );
};

export default DisabledInput;
