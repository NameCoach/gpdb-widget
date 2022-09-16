import { TFunction } from "i18next";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import SupportedLanguages from "../../translations/supported-languages";
import IFrontController from "../../types/front-controller";
import IStyleContext from "../../types/style-context";
import StyleContext from "../contexts/style";

interface HookReturn {
  t: TFunction;
  setLanguage: (language: SupportedLanguages) => void;
}

const useTranslator = (
  controller: IFrontController,
  styleContext?: IStyleContext
): HookReturn => {
  const _styleContext = styleContext || useContext(StyleContext);

  const loadT = (translations = {}): TFunction => {
    const { t, i18n: i18next } = useTranslation("translations", { i18n });

    const keys = Object.keys(translations);

    if (keys.length === 0) return t;

    keys.forEach((k) =>
      i18next.addResourceBundle(k, "translations", translations[k])
    );

    return t;
  };

  const setLanguage = (language: SupportedLanguages): void => {
    i18n.changeLanguage(language);
  };

  const t = _styleContext?.t || loadT(controller?.preferences?.translations);

  return { t, setLanguage };
};

export default useTranslator;
