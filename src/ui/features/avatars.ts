import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import {
  Features,
  FeaturesManager as ICustomFeaturesManager,
} from "../customFeaturesManager";
import { UserPermissions } from "../../types/permissions";
import { Resources } from "gpdb-api-client";

interface IAvatars {
  readonly showAvatars: () => boolean;
}

export const useAvatars = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions,
): IAvatars => {
  const featureAbsent = !customFeaturesManager.isPresent(
    Features.Avatars
  );
  const featureEnabled = !featureAbsent && customFeaturesManager.getValue(Features.Avatars);
  const permissionsGranted =
    permissionsManager.can(Resources.Avatars, "show") &&
    permissionsManager.can(Resources.Avatars, "create") &&
    permissionsManager.can(Resources.Avatars, "destroy");
  
  const showAvatars = () => {
    if (featureAbsent) return false;
    if (!permissionsGranted) return false;

    return featureEnabled;
  };
  
  return {
    showAvatars,
  }
}
