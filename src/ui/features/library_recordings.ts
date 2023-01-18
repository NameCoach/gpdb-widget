import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import {
  Features,
  FeaturesManager as ICustomFeaturesManager,
} from "../customFeaturesManager";
import { UserPermissions } from "../../types/permissions";
import { Resources } from "gpdb-api-client";

interface ILibraryRecordings {
  readonly showLibraryRecordings: () => boolean;
}

export const useLibraryRecordings = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions
): ILibraryRecordings => {
  const featureAbsent = !customFeaturesManager.isPresent(
    Features.LibraryRecordings
  );
  const featureEnabled = !featureAbsent && customFeaturesManager.getValue(Features.LibraryRecordings);
  const permissionsGranted =
    permissionsManager.can(Resources.PreferredRecordings, "show") &&
    permissionsManager.can(Resources.PreferredRecordings, "create") &&
    permissionsManager.can(Resources.PreferredRecordings, "destroy");

  const showLibraryRecordings = () => {
    if (featureAbsent) return false;
    if (!permissionsGranted) return false;

    return featureEnabled;
  };

  return {
    showLibraryRecordings,
  };
};
