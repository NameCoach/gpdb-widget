import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCreatePronunciationFeatures } from "./create_pronunciation";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import Pronunciation from "../../types/resources/pronunciation";
import { useDestroyPronunciationFeatures } from "./destroy_pronunciation";
import { UserPermissions } from "../../types/permissions";

interface RecorderFeatures {
  readonly showRecorderRecordButton: (
    pronunciation: Pronunciation,
    ownerSignature: string
  ) => boolean;
  readonly showSelfRecorderAction: (pronunciation: Pronunciation) => boolean;
}

export const useRecorderFeatures = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions
): RecorderFeatures => {
  const {
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
    canRecordNameBadge,
  } = useCreatePronunciationFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

  const { canDestroyPronunciation } = useDestroyPronunciationFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

  const showSelfRecorderAction = (pronunciation: Pronunciation): boolean =>
    canCreateSelfRecording(pronunciation) ||
    canDestroyPronunciation(pronunciation);

  const showRecorderRecordButton = (
    pronunciation: Pronunciation,
    ownerSignature: string
  ): boolean => {
    if (pronunciation && pronunciation.isHedb && !canRecordNameBadge())
      return false;

    return (
      canCreateSelfRecording(pronunciation) ||
      canCreateOrgPeerRecording(ownerSignature)
    );
  };

  return { showRecorderRecordButton, showSelfRecorderAction } as const;
};
