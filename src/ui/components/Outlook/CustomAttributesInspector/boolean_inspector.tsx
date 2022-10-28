import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

// TODO: replace icons to icon components
const BooleanInspector = ({ label, value }) => {
  return (
    <div className={cx(styles.inspector_container, styles.row)}>
      <div className={cx(styles.row)}>
        <p className={cx(styles.label)}>{label}</p>
      </div>
      <div className={cx(styles.row, styles.row_justify_end)}>
        <div className={cx(styles.icon_container)}>
          <i className={cx(value ? styles.check : styles.cross)} />
        </div>
      </div>
    </div>
  );
};

export default memo(BooleanInspector);
