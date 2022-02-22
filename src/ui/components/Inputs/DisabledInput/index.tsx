import React from "react";
import styles from "./styles.module.css";

interface Props {
  label: string;
  value: string;
  id: string;
}

const DisabledInput = ({ label, value }: Props): JSX.Element => {
  return (
    <div className={styles.line_wrapper}>
      <div className={styles.label}>{label}</div>
      <div className={styles.input_wrapper}>{value || ""}</div>
    </div>
  );
};

export default DisabledInput;
