import Pronunciation from "../../types/resources/pronunciation";
import usePermissions from "../hooks/usePermissions";

interface RestorePronunciationFeatures {
  readonly canRestoreSelfPronunciation: () => boolean;
  readonly canRestoreOrgPeerPronunciation: () => boolean;
  readonly canRestore: (pronunciation: Pronunciation) => boolean;
}

export const useRestorePronunciationFeatures = (
  permissionsManager
): RestorePronunciationFeatures => {
  const { canPronunciation } = usePermissions(permissionsManager);

  const canRestoreSelfPronunciation = (): boolean =>
    canPronunciation("restore") && canPronunciation("restore:self");

  const canRestoreOrgPeerPronunciation = (): boolean =>
    canPronunciation("restore") && canPronunciation("restore:org_peer");

  const canRestore = (pronunciation: Pronunciation): boolean =>
    (canRestoreSelfPronunciation() || canRestoreOrgPeerPronunciation()) &&
    pronunciation?.sourceType === "gpdb";

  return {
    canRestoreSelfPronunciation,
    canRestoreOrgPeerPronunciation,
    canRestore,
  } as const;
};
