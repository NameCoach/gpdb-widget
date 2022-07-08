import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import usePermissions from "../hooks/usePermissions";

interface UserResponseFeatures {
  readonly canCreateUserResponse: (ownerSignature: string) => boolean;
}

export const useUserResponseFeatures = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
): UserResponseFeatures => {
  const { canUserResponse } = usePermissions(permissionsManager);

  const canCreateUserResponse = (ownerSignature: string): boolean =>
    customFeaturesManager.canUserResponse(ownerSignature) &&
    canUserResponse("create");

  return { canCreateUserResponse } as const;
};
