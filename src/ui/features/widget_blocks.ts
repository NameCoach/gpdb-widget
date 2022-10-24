import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { UserPermissions } from "../../types/permissions";
import { Features, FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";

interface IWidgetBlocks {
  readonly showPronunciationsBlock: () => boolean;
  readonly showPersonalBlock: () => boolean;
  readonly showSearchWidget: () => boolean;
}

export enum MetadataKeys {
  ShowBlocks = "show_blocks",
}

export enum Blocks {
  Pronunciation = "pronunciation",
  Personal = "personal",
  SearchWidget = "search"
}

export const useShowWidgetBlocks = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions,
): IWidgetBlocks => {
  const featureAbsent = !customFeaturesManager.isPresent(Features.WidgetBlocks);
  const metadata = customFeaturesManager.getMetadata(Features.WidgetBlocks);
  const showBlocks = metadata[MetadataKeys.ShowBlocks];
  const showBlocksInvalid = !showBlocks || !Array.isArray(showBlocks);

  const showPronunciationsBlock = () => {
    if (featureAbsent) return true;
    if (showBlocksInvalid) return false;

    return showBlocks.includes(Blocks.Pronunciation);
  };
  
  const showPersonalBlock = () => {
    if (featureAbsent) return true;
    if (showBlocksInvalid) return false;

    return showBlocks.includes(Blocks.Personal);
  };

  const showSearchWidget = () => {
    if (featureAbsent) return true;
    if (showBlocksInvalid) return false;

    return showBlocks.includes(Blocks.SearchWidget);
  };

  return {
    showPronunciationsBlock,
    showPersonalBlock,
    showSearchWidget,
  }
};
