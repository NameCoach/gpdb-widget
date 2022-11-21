import { TFunction } from "i18next";
import { FeaturesManager } from "../ui/customFeaturesManager";

export enum Theme {
  Outlook = "outlook",
  Default = "default",
}

type IStyleContext = {
  displayRecorderSavingMessage: boolean;
  t?: TFunction;
  customFeatures?: FeaturesManager;
  theme?: Theme;
};

export default IStyleContext;
