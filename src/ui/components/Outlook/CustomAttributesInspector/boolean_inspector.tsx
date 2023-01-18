import classNames from "classnames/bind";
import React, { memo } from "react";
import styles from "./styles.module.css";
import { InspectorProps } from "./types";

const cx = classNames.bind(styles);

// TODO: replace icons to icon components
const BooleanInspector = ({
  label,
  value,
  isChild,
}: InspectorProps): JSX.Element => {
  const isValuePresent = value === true;

  return (
    <>
      {isValuePresent && (
        <div className={cx(styles.inspector_container, styles.row)}>
          <div className={cx(styles.row)}>
            <p className={cx(styles.label, { isChild })}>{label}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(BooleanInspector);
