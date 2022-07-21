import { Theme } from "../../../types/style-context";
import { CustomStyles } from "../../components/Select";
import outlookTheme from "./outlookTheme";
import defaultTheme from "./defaultTheme";

export interface SelectTheme {
  FullNamesList: CustomStyles;
  NameLine: CustomStyles;
  filterOption: (_) => (Option: any) => boolean;
}

type IThemes = {
  [key in Theme]: SelectTheme;
};

const Themes: IThemes = {
  [Theme.Default]: defaultTheme,
  [Theme.Outlook]: outlookTheme,
};

export default Themes;
