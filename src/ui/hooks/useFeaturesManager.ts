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
import { UserPermissions } from "../../types/permissions";

interface FeaturesManager {
  readonly can: (name: string, ...rest: any[]) => boolean;
  readonly show: (name: string, ...rest: any[]) => boolean;
}

const useFeaturesManager = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions
): FeaturesManager => {
  const { canPronunciation, canUserResponse } = usePermissions(
    permissionsManager,
    enforcedPermissions
  );

  const {
    canCreateCustomAttributes,
    showCustomAttributesForSelf,
    canEditCustomAttributesForSelf,
  } = useCustomAttributesFeatures(permissionsManager, enforcedPermissions);

  const {
    canRecordNameBadge,
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
  } = useCreatePronunciationFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

  const {
    customDestroy,
    canDestroyPronunciation,
  } = useDestroyPronunciationFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

  const {
    canRestoreSelfPronunciation,
    canRestoreOrgPeerPronunciation,
    canRestore,
  } = useRestorePronunciationFeatures(permissionsManager, enforcedPermissions);

  const { canCreateUserResponse } = useUserResponseFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

  const {
    canCreateRecordingRequest,
    canFindRecordingRequest,
  } = useRecordingRequestFeatures(permissionsManager, enforcedPermissions);

  const {
    showRecorderRecordButton,
    showSelfRecorderAction,
  } = useRecorderFeatures(
    permissionsManager,
    customFeaturesManager,
    enforcedPermissions
  );

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
