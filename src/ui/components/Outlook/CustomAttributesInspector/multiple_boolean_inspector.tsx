import React, { Fragment, memo, useMemo } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import BooleanInspector from "./boolean_inspector";
import { MultipleCheckboxField } from "../../../../types/resources/custom-attribute";
import { InspectorProps } from "./types";
import Gap from "../../../kit/Gap";
const cx = classNames.bind(styles);

const MultipleBooleanInspector = ({
  label,
  value,
}: InspectorProps): JSX.Element => {
  if (value === undefined || null) return null;

  const values = value as MultipleCheckboxField[];
  const valuesLastItemIndex = useMemo(() => values.length - 1, [value]);

  if (values.every((i) => i.value === false)) return null;

  return (
    <div className={cx(styles.inspector_container, styles.column)}>
      <div className={cx(styles.row, styles.margin_bottom_6)}>
        <p className={cx(styles.label)}>{label}</p>
      </div>

      <div className={styles.column}>
        {values
          .filter(({ value }) => value === true)
          .map(({ id, value: itemValue, label: itemLabel }, index) => {
            if (value === false) return null;

            return (
              <Fragment key={id}>
                <BooleanInspector value={itemValue} label={itemLabel} isChild />

                {index !== valuesLastItemIndex ? <Gap height={5} /> : null}
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default memo(MultipleBooleanInspector);
