import { Resources } from "gpdb-api-client";
import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCallback } from "react";

interface Permissions {
  readonly canPronunciation: (permission: string) => boolean;
  readonly canUserResponse: (permission: string) => boolean;
  readonly canRecordingRequest: (permission: string) => boolean;
  readonly canCustomAttributes: (permission: string) => boolean;
}

const usePermissions = (
  permissionsManager: IPermissionsManager
): Permissions => {
  const canPronunciation = useCallback(
    (permission: string): boolean =>
      permissionsManager.can(Resources.Pronunciation, permission),
    [permissionsManager]
  );

  const canUserResponse = useCallback(
    (permission: string): boolean =>
      permissionsManager.can(Resources.UserResponse, permission),
    [permissionsManager]
  );

  const canRecordingRequest = useCallback(
    (permission: string): boolean =>
      permissionsManager.can(Resources.RecordingRequest, permission),
    [permissionsManager]
  );

  const canCustomAttributes = useCallback(
    (permission: string): boolean =>
      permissionsManager.can(Resources.CustomAttributes, permission),
    [permissionsManager]
  );

  return {
    canPronunciation,
    canUserResponse,
    canRecordingRequest,
    canCustomAttributes,
  } as const;
};

export default usePermissions;
