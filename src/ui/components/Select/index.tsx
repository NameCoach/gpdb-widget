import React, { useMemo } from "react";
import Select from "react-select";
import { BRAND, _SECONDARY } from "../../styles/variables/colors";
export interface Option {
  value: string | number;
  label: string;
}
interface Props {
  onChange: (Option) => void;
  options: Option[];
  className?: string;
  styles?: { control: object; singleValue: object };
  value?: Option;
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

const customStyles = (controlStyles = { control: {}, singleValue: {} }) => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    boxShadow: null,
    ...controlStyles.control,
  }),
  valueContainer: (provided, state) => {
    const value = state.getValue()[0];
    const labelLength = value?.label?.length || 30;
    return {
      ...provided,
      minHeight: "30px",
      height: labelLength > 30 ? "45px" : "30px",
      padding: "0 6px",
      color: "black",
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
      styles={customStyles(props.styles)}
    />
  );
};

export default SelectComponent;
