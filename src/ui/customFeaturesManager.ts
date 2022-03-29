import { Feature } from "gpdb-api-client";

type Style = { [x: string]: string };

export interface FeaturesManager {
  getStyle: (key: string) => Style;
  isPresent: (key: string) => boolean;
}

export class CustomFeaturesManager implements FeaturesManager {
  private readonly customFeatures: { [x: string]: Feature };

  constructor(customFeatures) {
    this.customFeatures = customFeatures;
  }

  getStyle = (key: string): Style => {
    const feature = this.customFeatures[key];
    if (!feature) return {} as Style;

    return feature.metadata?.style || ({} as Style);
  };

  isPresent = (key: string): boolean => {
    const feature = this.customFeatures[key];

    return !!feature;
  };
}
