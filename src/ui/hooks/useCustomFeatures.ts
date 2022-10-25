import { useContext } from "react";
import IFrontController from "../../types/front-controller";
import StyleContext from "../contexts/style";
import {
  CustomFeaturesManager,
  FeaturesManager,
} from "../customFeaturesManager";

const useCustomFeatures = (
  controller: IFrontController,
  styleContext = useContext(StyleContext)
): FeaturesManager => {
  const loadCustomFeatures = (): CustomFeaturesManager => {
    const controllerCustomFeatures = controller?.preferences?.custom_features;

    if (
      !controllerCustomFeatures ||
      Object.keys(controllerCustomFeatures).length === 0
    )
      return new CustomFeaturesManager({});

    return new CustomFeaturesManager(controllerCustomFeatures);
  };

  const customFeatures = styleContext?.customFeatures || loadCustomFeatures();

  return customFeatures;
};

export default useCustomFeatures;
