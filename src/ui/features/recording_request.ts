import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { UserPermissions } from "../../types/permissions";
import usePermissions from "../hooks/usePermissions";

interface RecordingRequestFeatures {
  readonly canCreateRecordingRequest: () => boolean;
  readonly canFindRecordingRequest: () => boolean;
  readonly canUseRecordingRequest: () => boolean;
}

export const useRecordingRequestFeatures = (
  permissionsManager: IPermissionsManager,
  enforcedPermissions?: UserPermissions
): RecordingRequestFeatures => {
  const { canRecordingRequest } = usePermissions(
    permissionsManager,
    enforcedPermissions
  );

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
