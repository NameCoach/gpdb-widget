// REMOVE THIS LATER, not used anymore

import React, { memo } from "react";
import {
  AttributePresentation,
  CustomAttributesValues,
  CustomAttributeValue,
} from "../../../../types/resources/custom-attribute";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Select from "../../Select";
import Checkbox from "../Checkbox";

const cx = classNames.bind(styles);

interface Props {
  label: string;
  id: string;
  value: CustomAttributeValue;
  metadata?: Record<string, any>;
  type: string;
  values?: CustomAttributesValues;
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
    (values as Array<any>).map((value) => {
      return { value, label: value };
    });

  const Dropdown = (): JSX.Element => (
    <Select
      className={styles.dropdown_control}
      onChange={onSelect}
      options={getOptions()}
      value={{ value: value as string, label: value as string }}
    />
  );

  const Textarea = (): JSX.Element => (
    <textarea
      rows={3}
      onChange={onChange}
      className={styles.input}
      name={label}
      placeholder={placeholder}
      value={value as string}
    />
  );

  const Textbox = (): JSX.Element => (
    <input
      onChange={onChange}
      className={styles.input}
      name={label}
      placeholder={placeholder}
      value={value as string}
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
      value={value as boolean}
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
