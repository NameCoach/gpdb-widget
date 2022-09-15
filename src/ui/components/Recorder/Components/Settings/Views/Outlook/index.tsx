import React from "react";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const OutlookView = ({ onClick }: SettingsProps): JSX.Element => {
  const options = { onClick };

  return (
    <>
      <button className={styles.btn__link} {...options}>
        Having trouble with pitch?
      </button>
    </>
  );
};

export default OutlookView;
