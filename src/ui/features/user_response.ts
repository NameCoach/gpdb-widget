import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { UserPermissions } from "../../types/permissions";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import usePermissions from "../hooks/usePermissions";

interface UserResponseFeatures {
  readonly canCreateUserResponse: (ownerSignature: string) => boolean;
}

export const useUserResponseFeatures = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions
): UserResponseFeatures => {
  const { canUserResponse } = usePermissions(
    permissionsManager,
    enforcedPermissions
  );

  const canCreateUserResponse = (ownerSignature: string): boolean =>
    customFeaturesManager.canUserResponse(ownerSignature) &&
    canUserResponse("create");

  return { canCreateUserResponse } as const;
};
