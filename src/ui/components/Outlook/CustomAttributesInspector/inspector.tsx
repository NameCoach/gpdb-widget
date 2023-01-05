import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { InspectorProps } from "./types";

const cx = classNames.bind(styles);

const Inspector = ({ label, value }: InspectorProps): JSX.Element => {
  return (
    <>
      {value && (
        <div
          className={cx(
            styles.inspector_container,
            styles.column,
            styles.transition
          )}
        >
          <div className={cx(styles.row, styles.margin_bottom_6)}>
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
