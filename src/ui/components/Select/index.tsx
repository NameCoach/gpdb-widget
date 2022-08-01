import React, { useMemo } from "react";
import Select from "react-select";
import { BRAND, _SECONDARY } from "../../styles/variables/colors";
import { Theme } from "../../../types/style-context";
export interface Option {
  value: string | number;
  label: string;
}

export interface CustomStyles {
  control: object;
  singleValue: object;
  menu: object;
  menuList: object;
  option: object;
  valueContainer: object;
}

interface Props {
  onChange: (Option) => void;
  options: Option[];
  className?: string;
  styles?: CustomStyles;
  value?: Option;
  filterOption?: (Option) => boolean;
}

const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: _SECONDARY,
    primary: BRAND,
    neutral30: BRAND,
  },
});

const customStyles = (theme) => (
  controlStyles = {
    control: {},
    singleValue: {},
    menu: {},
    menuList: {},
    valueContainer: {},
    option: {},
  }
) => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    borderColor:
      !state.isFocused && theme === Theme.Outlook
        ? "transparent"
        : provided.borderColor,
    ...controlStyles.control,
  }),
  valueContainer: (provided, state) => {
    return {
      ...provided,
      minHeight: "30px",
      height: "30px",
      padding: "0 6px",
      color: "black",
      ...controlStyles.valueContainer,
    };
  },
  singleValue: (provided, state) => ({
    ...provided,
    ...controlStyles.singleValue,
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
    color: "black",
    ...controlStyles.menuList,
  }),
  menu: (provided) => ({
    ...provided,
    color: "black",
    ...controlStyles.menu,
  }),
  option: (provided) => ({
    ...provided,
    lineHeight: "15px",
    ...controlStyles.option,
  }),
});

const SelectComponent = (props: Props): JSX.Element => {
  const initValue = useMemo(() => props.options[0], props.options);

  const handleOnChange = (selectedValue: Option): void =>
    props.onChange(selectedValue);

  return (
    <Select
      defaultValue={initValue}
      value={props.value}
      options={props.options}
      className={props.className}
      onChange={handleOnChange}
      isClearable={false}
      isSearchable={false}
      theme={theme}
      styles={customStyles(props.className)(props.styles)}
      filterOption={props.filterOption}
    />
  );
};

export default SelectComponent;
