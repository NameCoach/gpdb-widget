import usePermissions from "../hooks/usePermissions";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import Pronunciation from "../../types/resources/pronunciation";

interface CreatePronunciationFeatures {
  readonly canRecordNameBadge: () => boolean;
  readonly canCreateOrgPeerRecording: (ownerSignature: string) => boolean;
  readonly canCreateSelfRecording: (pronunciation: Pronunciation) => boolean;
}

export const useCreatePronunciationFeatures = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
): CreatePronunciationFeatures => {
  const { canPronunciation } = usePermissions(permissionsManager);
  const canRecordNameBadge = (): boolean =>
    canPronunciation("create:name_badge") &&
    canPronunciation("index:name_badge");

  const canCreateOrgPeerRecording = (ownerSignature: string): boolean =>
    customFeaturesManager.canRecordOrgPeer(ownerSignature) &&
    canPronunciation("create");

  const canCreateSelfRecording = (pronunciation: Pronunciation): boolean =>
    (canRecordNameBadge() && pronunciation?.isHedb) ||
    (canPronunciation("create") && !pronunciation?.isHedb);

  return {
    canRecordNameBadge,
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
  } as const;
};
