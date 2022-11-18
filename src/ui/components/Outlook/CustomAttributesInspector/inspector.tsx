import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const Inspector = ({ label, value }) => {
  return (
    <>
      {value && (
        <div className={cx(styles.inspector_container, styles.column)}>
          <div className={cx(styles.row)}>
            <p className={cx(styles.label)}>{label}</p>
          </div>
          <div className={styles.row}>
            <p className={cx(styles.value)}>{value}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Inspector);
