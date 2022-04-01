import { Feature } from "gpdb-api-client";

type Style = { [x: string]: string };

export interface FeaturesManager {
  getStyle: (key: string) => Style;
  isPresent: (key: string) => boolean;
  getValue: (key: string) => any;
  getMetadata: (key: string) => { [x: string]: any } | {};
  canRecordOrgPeer: (key: string) => boolean;
  canUserResponse: (key: string) => boolean;
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

  getValue = (key: string): any => {
    const feature = this.customFeatures[key];

    if (!feature) return null;

    return feature.value;
  };

  getMetadata = (key: string): { [x: string]: any } => {
    const feature = this.customFeatures[key];

    if (!feature) return {};

    return feature.metadata;
  };

  canRecordOrgPeer = (ownerSignature): boolean => {
    const customRules = this.getValue("can_record_org_peer");
    if (!customRules) return true;

    const metadata = this.getMetadata("can_record_org_peer");

    if (customRules.include("exclude_name_owner")) {
      const excludeOwnerRegex = new RegExp(metadata.exclude_name_owner);

      return !excludeOwnerRegex.test(ownerSignature);
    }

    return true;
  };

  canUserResponse = (ownerSignature): boolean => {
    const customRules = this.getValue("can_user_response");
    if (!customRules) return true;

    const metadata = this.getMetadata("can_user_response");

    if (customRules.includes("exclude_name_owner")) {
      const excludeOwnerRegex = new RegExp(metadata.exclude_name_owner);

      return !excludeOwnerRegex.test(ownerSignature);
    }

    return true;
  };
}
