import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

// TODO: replace icons to icon components
const BooleanInspector = ({ label, value }) => {
  const isValuePresent = value === true;

  return (
    <>
      {isValuePresent && (
        <div className={cx(styles.inspector_container, styles.row)}>
          <div className={cx(styles.row)}>
            <p className={cx(styles.label)}>{label}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(BooleanInspector);
