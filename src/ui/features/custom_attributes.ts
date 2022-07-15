import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCallback } from "react";
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
  permissionsManager: IPermissionsManager
): CustomAttributesFeatures => {
  const { canPronunciation, canCustomAttributes } = usePermissions(
    permissionsManager
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

  const canCreateCustomAttributes = (
    nameOwner,
    userContext,
    customAttributesConfig
  ): boolean =>
    nameOwner.signature === userContext.signature &&
    customAttributesConfig?.length > 0 &&
    (canCreateGpdbCustomAttributes() ||
      canCreateHedbNameBadgeCustomAttributes());

  const canEditCustomAttributesForSelf = (
    pronunciation: Pronunciation
  ): boolean => {
    if (!pronunciation)
      return (
        canCreateGpdbCustomAttributes() ||
        canCreateHedbNameBadgeCustomAttributes()
      );

    const sourceIsNameBadge =
      pronunciation.sourceType === SourceType.HedbNameBadge;
    const sourceIsGpdb = pronunciation.sourceType === SourceType.Gpdb;
    const sourceIsHedb = pronunciation.sourceType === SourceType.Hedb;

    const canEditNameBadge =
      sourceIsNameBadge && canCreateHedbNameBadgeCustomAttributes();
    const canEditGpdb = sourceIsGpdb && canCreateGpdbCustomAttributes();

    return (canEditNameBadge || canEditGpdb) && !sourceIsHedb;
  };

  const showCustomAttributesForSelf = (
    pronunciation: Pronunciation,
    customAttributesConfig: any
  ): boolean => {
    const dataPresent =
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
