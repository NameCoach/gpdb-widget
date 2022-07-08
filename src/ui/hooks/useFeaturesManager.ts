import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import usePermissions from "./usePermissions";
import { useCustomAttributesFeatures } from "../features/custom_attributes";
import { useCreatePronunciationFeatures } from "../features/create_pronunciation";
import { useDestroyPronunciationFeatures } from "../features/destroy_pronunciation";
import { useRestorePronunciationFeatures } from "../features/restore_pronunciation";
import { useUserResponseFeatures } from "../features/user_response";
import { useRecordingRequestFeatures } from "../features/recording_request";
import { useRecorderFeatures } from "../features/recorder";

interface FeaturesManager {
  readonly can: (name: string, ...rest: any[]) => boolean;
  readonly show: (name: string, ...rest: any[]) => boolean;
}

const useFeaturesManager = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
): FeaturesManager => {
  const { canPronunciation, canUserResponse } = usePermissions(
    permissionsManager
  );

  const {
    canCreateCustomAttributes,
    showCustomAttributesForSelf,
    canEditCustomAttributesForSelf,
  } = useCustomAttributesFeatures(permissionsManager);

  const {
    canRecordNameBadge,
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
  } = useCreatePronunciationFeatures(permissionsManager, customFeaturesManager);

  const {
    customDestroy,
    canDestroyPronunciation,
  } = useDestroyPronunciationFeatures(
    permissionsManager,
    customFeaturesManager
  );

  const {
    canRestoreSelfPronunciation,
    canRestoreOrgPeerPronunciation,
    canRestore,
  } = useRestorePronunciationFeatures(permissionsManager);

  const { canCreateUserResponse } = useUserResponseFeatures(
    permissionsManager,
    customFeaturesManager
  );

  const {
    canCreateRecordingRequest,
    canFindRecordingRequest,
  } = useRecordingRequestFeatures(permissionsManager);

  const {
    showRecorderRecordButton,
    showSelfRecorderAction,
  } = useRecorderFeatures(permissionsManager, customFeaturesManager);

  const showContext = {
    recorderRecordButton: showRecorderRecordButton,
    selfRecorderAction: showSelfRecorderAction,

    customAttributesForSelf: showCustomAttributesForSelf,
  };

  const canContext = {
    createRecordingRequest: canCreateRecordingRequest,
    findRecordingRequest: canFindRecordingRequest,

    restoreOrgPeerPronunciation: canRestoreOrgPeerPronunciation,
    restoreSelfPronunciation: canRestoreSelfPronunciation,
    restore: canRestore,

    createUserResponse: canCreateUserResponse,
    userResponse: canUserResponse,

    destroyPronunciation: canDestroyPronunciation,
    customDestroy: customDestroy,

    createSelfRecording: canCreateSelfRecording,
    createOrgPeerRecording: canCreateOrgPeerRecording,
    recordNameBadge: canRecordNameBadge,

    pronunciation: canPronunciation,

    createCustomAttributes: canCreateCustomAttributes,
    editCustomAttributesForSelf: canEditCustomAttributesForSelf,
  };

  const can = (name: string, ...rest): boolean => canContext[name](...rest);
  const show = (name: string, ...rest): boolean => showContext[name](...rest);

  return { can, show } as const;
};

export default useFeaturesManager;
