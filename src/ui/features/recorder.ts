import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCreatePronunciationFeatures } from "./create_pronunciation";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import Pronunciation from "../../types/resources/pronunciation";
import { useDestroyPronunciationFeatures } from "./destroy_pronunciation";

interface RecorderFeatures {
  readonly showRecorderRecordButton: (
    pronunciation: Pronunciation,
    ownerSignature: string
  ) => boolean;
  readonly showSelfRecorderAction: (pronunciation: Pronunciation) => boolean;
}

export const useRecorderFeatures = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
): RecorderFeatures => {
  const {
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
    canRecordNameBadge,
  } = useCreatePronunciationFeatures(permissionsManager, customFeaturesManager);

  const { canDestroyPronunciation } = useDestroyPronunciationFeatures(
    permissionsManager,
    customFeaturesManager
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
