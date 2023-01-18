import React, { memo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { CustomAttributesInputsProps } from "../types";
import Gap from "../../../../kit/Gap";

const cx = classNames.bind(styles);

const Radio = ({
  id,
  label,
  value,
  values,
  onChange,
}: CustomAttributesInputsProps): JSX.Element => {
  const onValueChanged = ({ target: { value } }: any): void =>
    onChange(id, value);

  return (
    <div className={cx(styles.container, styles.column, styles.filarea)}>
      <div className={styles.row}>
        <label className={cx(styles.label)} htmlFor={id}>
          {label}
        </label>
      </div>

      <div className={cx(styles.column, styles.filarea, styles.list)}>
        {(values as string[]).map((fieldValue, index) => {
          return (
            <>
              {index !== 0 ? <Gap height={9} /> : null}

              <div className={styles.row} key={index}>
                <label
                  className={cx(styles.label, { isChild: true })}
                  htmlFor={fieldValue}
                >
                  {fieldValue}
                </label>

                <input
                  type="radio"
                  id={fieldValue}
                  value={fieldValue}
                  checked={value === fieldValue}
                  className={styles.justify_right}
                  onChange={onValueChanged}
                />
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Radio);
