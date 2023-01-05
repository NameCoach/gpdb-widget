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
import { useShowWidgetBlocks } from "../features/widget_blocks";
import ControllerContext from "../contexts/controller";
import { useContext } from "react";
import IStyleContext from "../../types/style-context";
import StyleContext from "../contexts/style";
import IFrontController from "../../types/front-controller";
import useCustomFeatures from "./useCustomFeatures";

interface FeaturesManager {
  readonly can: (name: string, ...rest: any[]) => boolean;
  readonly show: (name: string, ...rest: any[]) => boolean;
}

export enum ShowComponents {
  RecorderRecordButton = "recorderRecordButton",
  SelfRecorderAction = "selfRecorderAction",
  CustomAttributesForSelf = "customAttributesForSelf",
  PronunciationsBlock = "showPronunciationsBlock",
  PersonalBlock = "showPersonalBlock",
  SearchWidget = "showSearchWidget",
}

export enum CanComponents {
  CreateRecordingRequest = "createRecordingRequest",
  FindRecordingRequest = "findRecordingRequest",
  RestoreOrgPeerPronunciation = "restoreOrgPeerPronunciation",
  RestoreSelfPronunciation = "restoreSelfPronunciation",
  Restore = "restore",
  CreateUserResponse = "createUserResponse",
  UserResponse = "userResponse",
  DestroyPronunciation = "destroyPronunciation",
  CustomDestroy = "customDestroy",
  CreateSelfRecording = "createSelfRecording",
  CreateOrgPeerRecording = "createOrgPeerRecording",
  RecordNameBadge = "recordNameBadge",
  Pronunciation = "pronunciation",
  CreateCustomAttributes = "createCustomAttributes",
  EditCustomAttributesForSelf = "editCustomAttributesForSelf",
}

const useFeaturesManager = (
  permissionsManager?: IPermissionsManager,
  customFeaturesManager?: ICustomFeaturesManager,
  enforcedPermissions?: UserPermissions
): FeaturesManager => {
  const controller = useContext<IFrontController>(ControllerContext);
  const styleContext = useContext<IStyleContext>(StyleContext);
  const customFeatures = useCustomFeatures(controller, styleContext);

  const _permissionsManager = permissionsManager || controller.permissions;
  const _customFeaturesManager = customFeaturesManager || customFeatures;

  const { canPronunciation, canUserResponse } = usePermissions(
    _permissionsManager,
    enforcedPermissions
  );

  const {
    canCreateCustomAttributes,
    showCustomAttributesForSelf,
    canEditCustomAttributesForSelf,
  } = useCustomAttributesFeatures(_permissionsManager, enforcedPermissions);

  const {
    canRecordNameBadge,
    canCreateOrgPeerRecording,
    canCreateSelfRecording,
  } = useCreatePronunciationFeatures(
    _permissionsManager,
    _customFeaturesManager,
    enforcedPermissions
  );

  const {
    customDestroy,
    canDestroyPronunciation,
  } = useDestroyPronunciationFeatures(
    _permissionsManager,
    _customFeaturesManager,
    enforcedPermissions
  );

  const {
    canRestoreSelfPronunciation,
    canRestoreOrgPeerPronunciation,
    canRestore,
  } = useRestorePronunciationFeatures(_permissionsManager, enforcedPermissions);

  const { canCreateUserResponse } = useUserResponseFeatures(
    _permissionsManager,
    _customFeaturesManager,
    enforcedPermissions
  );

  const {
    canCreateRecordingRequest,
    canFindRecordingRequest,
  } = useRecordingRequestFeatures(_permissionsManager, enforcedPermissions);

  const {
    showRecorderRecordButton,
    showSelfRecorderAction,
  } = useRecorderFeatures(
    _permissionsManager,
    _customFeaturesManager,
    enforcedPermissions
  );

  const {
    showPronunciationsBlock,
    showPersonalBlock,
    showSearchWidget,
  } = useShowWidgetBlocks(
    _permissionsManager,
    _customFeaturesManager,
    enforcedPermissions
  );

  const showContext = {
    [ShowComponents.RecorderRecordButton]: showRecorderRecordButton,
    [ShowComponents.SelfRecorderAction]: showSelfRecorderAction,
    [ShowComponents.CustomAttributesForSelf]: showCustomAttributesForSelf,
    [ShowComponents.PronunciationsBlock]: showPronunciationsBlock,
    [ShowComponents.PersonalBlock]: showPersonalBlock,
    [ShowComponents.SearchWidget]: showSearchWidget,
  };

  const canContext = {
    [CanComponents.CreateRecordingRequest]: canCreateRecordingRequest,
    [CanComponents.FindRecordingRequest]: canFindRecordingRequest,

    [CanComponents.RestoreOrgPeerPronunciation]: canRestoreOrgPeerPronunciation,
    [CanComponents.RestoreSelfPronunciation]: canRestoreSelfPronunciation,
    [CanComponents.Restore]: canRestore,

    [CanComponents.CreateUserResponse]: canCreateUserResponse,
    [CanComponents.UserResponse]: canUserResponse,

    [CanComponents.DestroyPronunciation]: canDestroyPronunciation,
    [CanComponents.CustomDestroy]: customDestroy,

    [CanComponents.CreateSelfRecording]: canCreateSelfRecording,
    [CanComponents.CreateOrgPeerRecording]: canCreateOrgPeerRecording,
    [CanComponents.RecordNameBadge]: canRecordNameBadge,

    [CanComponents.Pronunciation]: canPronunciation,

    [CanComponents.CreateCustomAttributes]: canCreateCustomAttributes,
    [CanComponents.EditCustomAttributesForSelf]: canEditCustomAttributesForSelf,
  };

  const can = (name: string, ...rest): boolean => canContext[name](...rest);
  const show = (name: string, ...rest): boolean => showContext[name](...rest);

  return { can, show } as const;
};

export default useFeaturesManager;
