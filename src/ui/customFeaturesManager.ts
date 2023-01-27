import { Feature } from "gpdb-api-client";
import parse from "html-react-parser";

// TODO: clean this mess. NAM-1071 
type Style = { [x: string]: string };

export enum Features {
  CanRecordOrgPeer = "can_record_org_peer",
  CanUserResponse = "can_user_response",
  Share = "gw-share-icon",
  RenderHtml = "custom_html_components",
  WidgetBlocks = "widget-blocks",
  LibraryRecordings = "library_recordings",
  Avatars = "avatars",
}

export enum ConstantOverrides {
  RestorePronunciationTime = "gw-restore-pronunciation-time",
  TooltipDelay = "tooltip-display-delay",
}

export enum StyleOverrides {
  PronunciationNameLineMessage = "pronunciation-name-line-message",
}

export enum ExcludeRule {
  NameOwner = "exclude_name_owner",
}

export enum HtmlComponents {
  UnderMyInfo = "under_my_info",
}

export interface FeaturesManager {
  getStyle: (key: string) => Style;
  isPresent: (key: string) => boolean;
  getValue: (key: string) => any;
  getMetadata: (key: string) => { [x: string]: any } | {};
  canRecordOrgPeer: (key: string) => boolean;
  canUserResponse: (key: string) => boolean;
  renderCustomComponent: (component: string) => any;
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
    const customRules = this.getValue(Features.CanRecordOrgPeer);
    if (!customRules) return true;

    const metadata = this.getMetadata(Features.CanRecordOrgPeer);

    if (customRules.includes(ExcludeRule.NameOwner)) {
      const excludeOwnerRegex = new RegExp(metadata.exclude_name_owner);

      return !excludeOwnerRegex.test(ownerSignature);
    }

    return true;
  };

  canUserResponse = (ownerSignature): boolean => {
    const customRules = this.getValue(Features.CanUserResponse);
    if (!customRules) return true;

    const metadata = this.getMetadata(Features.CanUserResponse);

    if (customRules.includes(ExcludeRule.NameOwner)) {
      const excludeOwnerRegex = new RegExp(metadata.exclude_name_owner);

      return !excludeOwnerRegex.test(ownerSignature);
    }

    return true;
  };

  renderCustomComponent = (component): any => {
    const customComponents = this.getValue(Features.RenderHtml);

    if (!customComponents) return;

    if (customComponents.includes(component)) {
      const metadata = this.getMetadata(Features.RenderHtml);

      return parse(metadata[component]);
    }
  };
}
