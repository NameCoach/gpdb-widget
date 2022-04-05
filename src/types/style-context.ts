import { TFunction } from "i18next";
import { FeaturesManager } from "../ui/customFeaturesManager";

type IStyleContext = {
  displayRecorderSavingMessage: boolean;
  t?: TFunction;
  customFeatures?: FeaturesManager;
};

export default IStyleContext;
