import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

export default function loadT(translations = {}): TFunction {
  const { t, i18n: i18next } = useTranslation("translations", { i18n });

  const keys = Object.keys(translations);

  if (keys.length === 0) {
    return t;
  }

  keys.forEach((k) => {
    i18next.addResourceBundle(k, "translations", translations[k]);
  });

  return t;
}
