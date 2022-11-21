import React, { memo } from "react";
import { AttributePresentation } from "../../../../types/resources/custom-attribute";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Select from "../../Select";
import Checkbox from "../Checkbox";

const cx = classNames.bind(styles);

interface Props {
  label: string;
  id: string;
  value: string;
  metadata?: Record<string, any>;
  type: string;
  values?: string[];
  onUpdate: (any) => void;
}

const CustomInput = ({
  id,
  value,
  type,
  label,
  metadata,
  values,
  onUpdate,
}: Props): JSX.Element => {
  const prompt = metadata?.prompt;
  const placeholder = prompt;

  const onChange = (e): void => {
    const {
      target: { value },
    } = e;

    onUpdate({ id, value });
  };

  const onSelect = ({ value }): void => {
    onUpdate({ id, value });
  };

  const getOptions = (): { value: string; label: string }[] =>
    values.map((value) => {
      return { value, label: value };
    });

  const Dropdown = (): JSX.Element => (
    <Select
      className={styles.dropdown_control}
      onChange={onSelect}
      options={getOptions()}
      value={{ value, label: value }}
    />
  );

  const Textarea = (): JSX.Element => (
    <textarea
      rows={3}
      onChange={onChange}
      className={styles.input}
      name={label}
      placeholder={placeholder}
      value={value}
    />
  );

  const Textbox = (): JSX.Element => (
    <input
      onChange={onChange}
      className={styles.input}
      name={label}
      placeholder={placeholder}
      value={value}
    />
  );

  const renderInput = (): JSX.Element => {
    switch (type) {
      case AttributePresentation.Dropdown:
        return Dropdown();
      case AttributePresentation.Textarea:
        return Textarea();
      case AttributePresentation.Textbox:
        return Textbox();
    }
  };

  const isCheckbox = type === AttributePresentation.Checkbox;

  return isCheckbox ? (
    <Checkbox
      id={id}
      label={label}
      value={value}
      disabled={false}
      onUpdate={onUpdate}
    />
  ) : (
    <div className={styles.field}>
      <p className={cx(styles.ca, styles.attributes_label)}>{label}</p>
      <div className={styles.input_field}>{renderInput()}</div>
    </div>
  );
};

export default memo(CustomInput);
