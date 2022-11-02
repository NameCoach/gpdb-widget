import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCallback } from "react";
import { UserPermissions } from "../../types/permissions";
import Pronunciation, { SourceType } from "../../types/resources/pronunciation";
import usePermissions from "../hooks/usePermissions";

interface CustomAttributesFeatures {
  readonly canCreateGpdbCustomAttributes: () => boolean;
  readonly canCreateHedbNameBadgeCustomAttributes: () => boolean;
  readonly canCreateCustomAttributes: (
    nameOwner: any,
    userContext: any,
    customAttributesConfig: any
  ) => boolean;
  readonly canEditCustomAttributesForSelf: (
    pronunciation: Pronunciation
  ) => boolean;
  readonly showCustomAttributesForSelf: (
    pronunciation: Pronunciation,
    customAttributesConfig: any
  ) => boolean;
}

export const useCustomAttributesFeatures = (
  permissionsManager: IPermissionsManager,
  enforcedPermissions?: UserPermissions
): CustomAttributesFeatures => {
  const { canPronunciation, canCustomAttributes } = usePermissions(
    permissionsManager,
    enforcedPermissions
  );

  const canCreateGpdbCustomAttributes = useCallback(
    (): boolean =>
      canCustomAttributes("save_values") &&
      canCustomAttributes("retrieve_config") &&
      canPronunciation("index:custom_attributes") &&
      !canPronunciation("create:name_badge"),
    []
  );

  const canCreateHedbNameBadgeCustomAttributes = useCallback(
    (): boolean =>
      canCustomAttributes("save_values:hedb_name_badge") &&
      canCustomAttributes("retrieve_config:hedb_name_badge") &&
      canPronunciation("index:hedb_name_badge_custom_attributes") &&
      canPronunciation("create:name_badge"),
    []
  );

  // Attention! these policies don't exist, and can change in https://name-coach.atlassian.net/browse/INT-241
  const canCreatePrivateHedbCustomAttributes = useCallback(
    (): boolean =>
      canCustomAttributes("save_values:hedb_private") &&
      canCustomAttributes("retrieve_config:hedb_private") &&
      canPronunciation("index:hedb_custom_attributes") &&
      !canPronunciation("create:name_badge"),
    []
  );

  const canCreateCustomAttributes = (
    nameOwner,
    userContext,
    customAttributesConfig
  ): boolean =>
    nameOwner.signature === userContext.signature &&
    customAttributesConfig?.length > 0 &&
    (canCreateGpdbCustomAttributes() ||
      canCreateHedbNameBadgeCustomAttributes() ||
      canCreatePrivateHedbCustomAttributes());

  const canEditCustomAttributesForSelf = (
    pronunciation: Pronunciation
  ): boolean => {
    if (!pronunciation)
      return (
        canCreateGpdbCustomAttributes() ||
        canCreateHedbNameBadgeCustomAttributes() ||
        canCreatePrivateHedbCustomAttributes()
      );

      const canEdit = {
        [SourceType.HedbNameBadge]: canCreateHedbNameBadgeCustomAttributes(),
        [SourceType.Gpdb]: canCreateGpdbCustomAttributes(),
        [SourceType.Hedb]: canCreatePrivateHedbCustomAttributes()

      }

    return canEdit[pronunciation.sourceType];
  };

  // #TODO: rework this, cause it mixes data and policies
  // rendering based on data existence should be performed in components
  // and aint have anything to do with policies and features
  const showCustomAttributesForSelf = (
    pronunciation: Pronunciation,
    customAttributesConfig: any
  ): boolean => {

      // reverse this to previous version after https://name-coach.atlassian.net/browse/INT-241
    const dataPresent = 
    pronunciation && 
    pronunciation.customAttributes &&
    pronunciation.customAttributes.length > 0 &&
    pronunciation.sourceType === SourceType.Hedb ?
    pronunciation.customAttributes.some(ca => ca.value) : 
      pronunciation &&
      pronunciation.customAttributes &&
      pronunciation.customAttributes.length > 0;

    const configPresent = customAttributesConfig?.length > 0;

    return (
      dataPresent ||
      (configPresent &&
        pronunciation &&
        canEditCustomAttributesForSelf(pronunciation))
    );
  };

  return {
    canCreateGpdbCustomAttributes,
    canCreateHedbNameBadgeCustomAttributes,
    canCreateCustomAttributes,
    canEditCustomAttributesForSelf,
    showCustomAttributesForSelf,
  } as const;
};
