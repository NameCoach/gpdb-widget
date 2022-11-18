import SupportedLanguages from "./supported-languages";
import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";

export default function (locale) {
  switch (locale) {
    case SupportedLanguages.EN:
      return translationEN;
    case SupportedLanguages.FR:
      return translationFR;
    default:
      return translationEN;
  }
}
