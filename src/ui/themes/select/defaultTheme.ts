import { SelectTheme } from "./index";

export default {
  NamesList: {
    control: {
      fontWeight: "bold",
      boxShadow: null,
    },
    singleValue: {
      textOverflow: "initial",
      whiteSpace: "normal",
      wordBreak: "break-word",
    },
  },
  NameLine: {},
  filterOption: (_) => (_) => true,
} as SelectTheme;
