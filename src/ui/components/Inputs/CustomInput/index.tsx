import React, { memo } from "react";
import { Insect } from "react-insect";
import { AttributePresentation } from "../../../../types/resources/custom-attribute";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  label: string;
  id: string;
  value: string;
  type: string;
  values?: string[];
  onUpdate: (any) => void;
}

const TYPES = {
  Textarea: "text",
  Textbox: "textarea",
  Dropdown: "select",
};

const CustomInput = ({
  id,
  value,
  type,
  label,
  values,
  onUpdate,
}: Props): JSX.Element => {
  const onChange = (e): void => {
    const {
      target: { value },
    } = e;
    onUpdate({ id, value });
  };

  const onSelect = (value): void => {
    onUpdate({ id, value });
  };

  const isDropdown = type === AttributePresentation.Dropdown;
  return (
    <>
      <Insect
        name={label}
        type={TYPES[type] as "text" | "textarea" | "select"}
        label={label}
        value={value}
        options={
          (isDropdown && values.map((v) => ({ title: v, value: v }))) || []
        }
        defaultOption={isDropdown && { title: value, value: value }}
        placeholder={label}
        rows={2}
        onSelect={onSelect}
        onChange={onChange}
        className={styles.ca}
        inputWrapperClass={cx(styles.ca, styles.attributes_input_wrapper)}
        inputClass={cx(styles.ca, styles.attributes_input)}
        labelClass={cx(styles.ca, styles.attributes_label)}
        checkerClass={cx(styles.ca, styles.attributes_checker)}
        dropdownClass={cx(styles.ca, styles.attributes_dropdown)}
      />
    </>
  );
};

export default memo(CustomInput);
