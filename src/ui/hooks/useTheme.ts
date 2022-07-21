import { useContext } from "react";
import StyleContext from "../contexts/style";
import IStyleContext, { Theme } from "../../types/style-context";
import SelectThemes from "../themes/select";

const useTheme = (component?: string, styleContext?: IStyleContext) => {
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
