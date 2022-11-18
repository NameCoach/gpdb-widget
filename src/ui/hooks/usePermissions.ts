import { Resources } from "gpdb-api-client";
import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { useCallback } from "react";
import { UserPermissions } from "../../types/permissions";

interface Permissions {
  readonly canPronunciation: (permission: string) => boolean;
  readonly canUserResponse: (permission: string) => boolean;
  readonly canRecordingRequest: (permission: string) => boolean;
  readonly canCustomAttributes: (permission: string) => boolean;
}

const usePermissions = (
  permissionsManager: IPermissionsManager,
  enforcedPermissions?: UserPermissions
): Permissions => {
  const {
    canPronunciation: _canPronunciation,
    canUserResponse: _canUserResponse,
    canRecordingRequest: _canRecordingRequest,
    canCustomAttributes: _canCustomAttributes,
  } = enforcedPermissions || {};

  const can = (
    permissionsManagerResource,
    enforcedPermissionsResource,
    permission: string
  ): boolean => {
    const result = enforcedPermissionsResource?.[permission];

    if (typeof result === "boolean") return result;

    return permissionsManager.can(permissionsManagerResource, permission);
  };

  const canPronunciation = useCallback(
    (permission: string): boolean =>
      can(Resources.Pronunciation, _canPronunciation, permission),
    [permissionsManager, enforcedPermissions]
  );

  const canUserResponse = useCallback(
    (permission: string): boolean =>
      can(Resources.UserResponse, _canUserResponse, permission),
    [permissionsManager, enforcedPermissions]
  );

  const canRecordingRequest = useCallback(
    (permission: string): boolean =>
      can(Resources.RecordingRequest, _canRecordingRequest, permission),
    [permissionsManager, enforcedPermissions]
  );

  const canCustomAttributes = useCallback(
    (permission: string): boolean =>
      can(Resources.CustomAttributes, _canCustomAttributes, permission),
    [permissionsManager, enforcedPermissions]
  );

  return {
    canPronunciation,
    canUserResponse,
    canRecordingRequest,
    canCustomAttributes,
  } as const;
};

export default usePermissions;
