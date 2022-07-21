import { SelectTheme } from "./index";

export default {
  FullNamesList: {
    control: { fontWeight: "bold" },
    singleValue: {
      textOverflow: "initial",
      whiteSpace: "normal",
      wordBreak: "break-word",
    },
  },
  NameLine: {},
  filterOption: (_) => (_) => true,
} as SelectTheme;
