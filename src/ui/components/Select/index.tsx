import React, {
  MutableRefObject,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Select from "react-select";
import { BRAND, _SECONDARY } from "../../styles/variables/colors";
import { Theme } from "../../../types/style-context";
import useTheme from "../../hooks/useTheme";
import DropdownIndicator from "./DropdownIndicator";
import Control, { CustomProps as ControlCustomProps } from "./Control";
export interface Option {
  value: string | number;
  label: string;
}

export interface CustomStyles {
  container?: object;
  control?: object;
  singleValue?: object;
  menu?: object;
  menuList?: object;
  option?: object;
  valueContainer?: object;
  placeholder?: object;
}

export interface SelectRef {
  menuOpened: boolean;
}

interface Props {
  controlCustomProps?: ControlCustomProps;
  onChange: (Option) => void;
  options: Option[];
  className?: string;
  styles?: CustomStyles;
  value?: Option;
  filterOption?: (Option) => boolean;
  disabled?: boolean;
  theme?: Theme;
  placeholder?: string;
  notFirstSelected?: boolean;
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
  controlStyles: CustomStyles = {
    container: {},
    control: {},
    singleValue: {},
    menu: {},
    menuList: {},
    valueContainer: {},
    option: {},
    placeholder: {},
  }
) => ({
  container: (provided, state) => {
    return {
      ...provided,
      ...controlStyles.container,
    };
  },
  control: (provided, state) => {
    const res = {
      ...provided,
      minHeight: "30px",
      cursor: "pointer",
      borderColor: provided.borderColor,
      "&:hover": {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
      },
      ...controlStyles.control,
    };

    if (!state.isFocused) {
      res["&:hover"].borderColor = "transparent";
      res.borderColor = "transparent";
    }
    return res;
  },
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
    cursor: "pointer",
    ...controlStyles.menu,
  }),
  option: (provided) => ({
    ...provided,
    lineHeight: "15px",
    cursor: "pointer",
    ...controlStyles.option,
  }),
  placeholder: (provided) => ({
    ...provided,
    ...controlStyles.placeholder,
  }),
});

const SelectComponent = (
  props: Props,
  ref: MutableRefObject<SelectRef>
): JSX.Element => {
  const { theme: appTheme } = useTheme();
  const firstSelectedOption = useMemo(() => props.options[0], props.options);
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  useImperativeHandle(
    ref,
    (): SelectRef => ({
      menuOpened,
    }),
    [menuOpened]
  );

  const handleOnChange = (selectedValue: Option): void =>
    props.onChange(selectedValue);

  const outlookProps =
    appTheme === Theme.Outlook
      ? {
          components: {
            DropdownIndicator,
            Control: Control(props.controlCustomProps),
          },
        }
      : {};

  return (
    <Select
      defaultValue={props.notFirstSelected ? null : firstSelectedOption}
      placeholder={props.placeholder}
      value={props.value}
      options={props.options}
      className={props.className}
      onChange={handleOnChange}
      isClearable={false}
      isSearchable={false}
      theme={theme}
      styles={customStyles(props.theme)(props.styles)}
      filterOption={props.filterOption}
      disabled={props.disabled}
      onMenuOpen={() => setMenuOpened(true)}
      onMenuClose={() => setMenuOpened(false)}
      {...outlookProps}
    />
  );
};

export default React.forwardRef(SelectComponent);
