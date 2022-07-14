import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import Pronunciation, {
  RelativeSource,
} from "../../types/resources/pronunciation";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import usePermissions from "../hooks/usePermissions";

interface DestroyPronunciationFeatures {
  readonly customDestroy: (
    customFeaturesManager: ICustomFeaturesManager
  ) => boolean;
  readonly canDestroyPronunciation: (pronunciation: Pronunciation) => boolean;
}

export const useDestroyPronunciationFeatures = (
  permissions: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
): DestroyPronunciationFeatures => {
  const { canPronunciation } = usePermissions(permissions);

  const customDestroy = (): boolean => {
    const customDestroyFeaturePresent = customFeaturesManager.isPresent(
      "recordings_custom_destroy"
    );

    const selfFeatureValuePresent = !!customFeaturesManager
      .getValue("recordings_custom_destroy")
      ?.find((item) => item === "self");

    const featureMetadataKeyPresent = !!customFeaturesManager.getMetadata(
      "self"
    );

    return (
      customDestroyFeaturePresent &&
      selfFeatureValuePresent &&
      featureMetadataKeyPresent
    );
  };

  const canDestroyPronunciation = (pronunciation: Pronunciation): boolean => {
    const customDestroyFeaturePresent = customFeaturesManager.isPresent(
      "recordings_custom_destroy"
    );

    const selfFeatureValuePresent = !!customFeaturesManager
      .getValue("recordings_custom_destroy")
      ?.find((item) => item === "self");

    const featureMetadataKeyPresent = !!customFeaturesManager.getMetadata(
      "self"
    );

    const isSelf =
      pronunciation &&
      pronunciation.relativeSource === RelativeSource.RequesterSelf;

    const isOrgPeer =
      pronunciation &&
      pronunciation.relativeSource === RelativeSource.RequesterPeer;

    const canDeleteSelf =
      canPronunciation("destroy") && canPronunciation("destroy:self");
    const canDeleteOrgPeer =
      canPronunciation("destroy") && canPronunciation("destroy:org_peer");
    const canDeleteHedbAll =
      canPronunciation("destroy") && canPronunciation("destroy:self_hedb_all");

    const condition =
      ((isSelf && canDeleteSelf) || (isOrgPeer && canDeleteOrgPeer)) &&
      !pronunciation.isHedb;

    const condition3 = isSelf && canDeleteHedbAll && pronunciation.isHedb;

    const condition2 =
      customDestroyFeaturePresent &&
      selfFeatureValuePresent &&
      featureMetadataKeyPresent &&
      isSelf;

    return condition || condition2 || condition3;
  };

  return { customDestroy, canDestroyPronunciation } as const;
};
