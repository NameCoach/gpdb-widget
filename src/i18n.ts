import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import localTranslations from "../src/translations/load";
import SupportedLanguages from "./translations/supported-languages";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: { ...localTranslations(SupportedLanguages.EN) },
      },
      fr: {
        translations: { ...localTranslations(SupportedLanguages.FR) },
      },
    },
    fallbackLng: SupportedLanguages.EN,
    debug: false,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
