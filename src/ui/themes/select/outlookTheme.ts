import { SelectTheme } from "./index";
import { DARK_GREY } from "../../styles/variables/colors";

const styles = {
  control: {
    fontWeight: 400,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    border: "none",
  },
  valueContainer: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
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
    color: DARK_GREY,
  },
  singleValue: {
    lineHeight: "18px",
  },
};

export default {
  FullNamesList: styles,
  NameLine: styles,
  filterOption: (selectedValue) => (o) => o.value !== selectedValue,
} as SelectTheme;
