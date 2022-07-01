import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import usePermissions from "../hooks/usePermissions";

interface RecordingRequestFeatures {
  readonly canCreateRecordingRequest: () => boolean;
  readonly canFindRecordingRequest: () => boolean;
  readonly canUseRecordingRequest: () => boolean;
}

export const useRecordingRequestFeatures = (
  permissionsManager: IPermissionsManager
): RecordingRequestFeatures => {
  const { canRecordingRequest } = usePermissions(permissionsManager);
  const canCreateRecordingRequest = (): boolean =>
    canRecordingRequest("create");

  const canFindRecordingRequest = (): boolean => canRecordingRequest("find");

  const canUseRecordingRequest = (): boolean =>
    canCreateRecordingRequest() && canFindRecordingRequest();

  return {
    canCreateRecordingRequest,
    canFindRecordingRequest,
    canUseRecordingRequest,
  } as const;
};
