import React, { memo, useContext, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

const BooleanInspector = ({ label, value }) => {
  return (
    <div className={cx(styles.inspector_container, styles.row)}>
      <div className={cx(styles.row)}>
        <p className={cx(styles.label)}>{label}</p>
      </div>
      <div className={cx(styles.row, styles.row_justify_end)}>
          <p className={cx(styles.value)}>{String(!!value)}</p>
      </div>
    </div>
  );
};

export default memo(BooleanInspector);
