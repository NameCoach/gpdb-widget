import { SelectTheme } from "./index";
import COLORS from "../../styles/variables/colors";

const styles = {
  control: {
    fontWeight: 400,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
  },
  valueContainer: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    color: COLORS.colors_dark_grey,
  },
  menu: {
    lineHeight: "17px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    border: "none",
  },
  menuList: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    color: COLORS.colors_dark_grey,
  },
  singleValue: {
    lineHeight: "17px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  option: {
    lineHeight: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: COLORS.colors_dark_grey,
  },
};

export default {
  NamesList: styles,
  NameLine: styles,
  filterOption: (selectedValue) => (o) => o.value !== selectedValue,
} as SelectTheme;
