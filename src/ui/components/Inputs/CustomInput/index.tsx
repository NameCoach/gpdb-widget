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

  const dropdownIcon = () => (
    <svg
      height="20"
      width="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      filter="invert(84%) sepia(0%) saturate(112%) hue-rotate(228deg) brightness(85%) contrast(137%)"
    >
      <path
        d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
        fill=""
      />
    </svg>
  );

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
        dropdownIcon={dropdownIcon()}
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
