import React, { useMemo } from "react";
import Select from "react-select";
import { BRAND_COLOR, SECONDARY_COLOR } from "../../../constants";

interface Option {
  value: string | number;
  label: string;
}
interface Props {
  onChange: (Option) => void;
  options: Option[];
  className?: string;
}

const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: SECONDARY_COLOR,
    primary: BRAND_COLOR,
    neutral30: BRAND_COLOR,
  },
});

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
    boxShadow: state.isFocused ? null : null,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
    color: "black",
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
};

const SelectComponent = (props: Props) => {
  const initValue = useMemo(() => props.options[0], props.options);

  return (
    <Select
      defaultValue={initValue}
      options={props.options}
      className={props.className}
      onChange={props.onChange}
      isClearable={false}
      isSearchable={false}
      theme={theme}
      styles={customStyles}
    />
  );
};

export default SelectComponent;
