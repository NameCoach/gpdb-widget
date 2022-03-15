import { useMemo } from "react";
import {
  CustomFeaturesManager,
  FeaturesManager,
} from "../customFeaturesManager";

export default function loadCustomFeatures(customFeatures): FeaturesManager {
  const load = () => {
    if (!customFeatures || Object.keys(customFeatures).length === 0)
      return new CustomFeaturesManager({});

    return new CustomFeaturesManager(customFeatures);
  };

  return useMemo(load, [customFeatures]);
}
