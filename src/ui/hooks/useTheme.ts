import { useContext } from "react";
import StyleContext from "../contexts/style";
import IStyleContext, { Theme } from "../../types/style-context";
import SelectThemes from "../themes/select";

type UseThemeReturn = {
  theme: Theme;
  selectStyles: any;
  filterOption: (_: any) => (Option: any) => boolean;
};

const useTheme = (
  component?: string,
  styleContext?: IStyleContext
): UseThemeReturn => {
  const _styleContext = styleContext || useContext(StyleContext);

  const theme = _styleContext.theme || Theme.Default;
  const selectStyles = SelectThemes[theme];
  const forComponent = selectStyles[component] || {};

  return {
    theme,
    selectStyles: forComponent,
    filterOption: selectStyles.filterOption,
  };
};

export default useTheme;
