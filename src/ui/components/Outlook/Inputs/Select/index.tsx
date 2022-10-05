import React, { memo } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { CustomAttributesInputsProps } from "../types";
import COLORS, { _SECONDARY } from "../../../../styles/variables/colors";
import _Select from "react-select";

const cx = classNames.bind(styles);

const _theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: _SECONDARY,
    primary: COLORS.colors_brand,
    neutral30: COLORS.colors_brand,
  },
});

const Select = ({
  id,
  value,
  label,
  disabled,
  metadata,
  values,
  onUpdate,
  hasErrors,
}: CustomAttributesInputsProps): JSX.Element => {
  const options = values?.map(value => ({ value, label: value }));
  const selectValue = value && String(value).length > 0 && { value: String(value), label: String(value) };

  const _styles = {
    control: (provided, state) => { 
      const res = {
        ...provided,
        minHeight: "30px",
        fontWeight: 400,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "6px",
        backgroundColor: COLORS.colors_background,
        borderColor: 'transparent',
        transition: "box-shadow 0.3s ease-in-out",
        '&:hover': {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          borderColor: 'transparent',
        },
      };
      if (hasErrors) {
        res.borderColor = COLORS.colors_red;
        res['&:hover'].borderColor = COLORS.colors_red;
      };
      if (state.isFocused) {
        res.borderColor = provided.borderColor;
        res['&:hover'].borderColor = provided.borderColor;
      };
      return res;
    },
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      height: "30px",
      padding: "0 6px",
      color: "black",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      lineHeight: "17px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: COLORS.colors_dark_grey,
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "30px",
    }),
    menuList: (provided) => ({
      ...provided,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      color: COLORS.colors_dark_grey,
    }),
    menu: (provided) => ({
      ...provided,
      color: "black",
      lineHeight: "17px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      border: "none",
    }),
    option: (provided) => ({
      ...provided,
      lineHeight: "15px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: COLORS.colors_light_grey,
    })
  };
  return (
    <div className={cx(styles.select_container, styles.column)}>
      <div className={cx(styles.row, styles.label_container)}>
        <p className={cx(styles.label)}>{label}</p>
      </div>
      <div className={cx(styles.row)}>
        <_Select
          id={id}
          onChange={onUpdate}
          value={selectValue}
          options={options}
          isDisabled={disabled}
          filterOption={(o) => o.value !== selectValue.value}
          isClearable={false}
          isSearchable={false}
          className={styles.select_input_container}
          styles={_styles}
          theme={_theme}
          placeholder={metadata?.placeholder}
        />
      </div>
    </div>
  );
};

export default memo(Select);
