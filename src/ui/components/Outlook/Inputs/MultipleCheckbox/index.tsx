import React, { Fragment, memo, useMemo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { CustomAttributesInputsProps } from "../types";
import { cloneDeep } from "lodash";
import { MultipleCheckboxField } from "../../../../../types/resources/custom-attribute";
import Checkbox from "../Checkbox";
import Gap from "../../../../kit/Gap";
const cx = classNames.bind(styles);

const MultipleCheckbox = ({
  id,
  label,
  disabled,
  value,
  onChange,
}: CustomAttributesInputsProps): JSX.Element => {
  const values = value as MultipleCheckboxField[];
  const valuesLastItemIndex = useMemo(() => values.length - 1, [value]);

  const onValueChanged = (checkboxId: string, checkboxValue: boolean): void => {
    const newValues: MultipleCheckboxField[] = cloneDeep(values);

    const item = newValues.find(({ id }) => id === checkboxId);
    item.value = checkboxValue;

    onChange(id, newValues);
  };

  return (
    <div className={cx(styles.container, styles.column, styles.filarea)}>
      <div className={cx(styles.row, styles.margin_bottom_10_5)}>
        <label className={cx(styles.label)} htmlFor={id}>
          {label}
        </label>
      </div>

      {values.map(({ id: checkboxId, label: checkboxLabel, value }, index) => {
        return (
          <Fragment key={index}>
            <div className={cx(styles.checkbox_container, styles.row)}>
              <Checkbox
                id={checkboxId}
                value={value || false}
                label={checkboxLabel}
                disabled={disabled}
                onChange={onValueChanged}
                isChild
              />
            </div>

            {index !== valuesLastItemIndex ? <Gap height={9} /> : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default memo(MultipleCheckbox);
