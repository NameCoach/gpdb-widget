import IPermissionsManager from "gpdb-api-client/build/main/types/permissions-manager";
import { FeaturesManager as ICustomFeaturesManager } from "../customFeaturesManager";
import { useMemo } from "react";
import { Resources } from "gpdb-api-client";
import Pronunciation, {
  RelativeSource,
} from "../../types/resources/pronunciation";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFeaturesManager = (
  permissionsManager: IPermissionsManager,
  customFeaturesManager: ICustomFeaturesManager
) => {
  // methods start
  const canPronunciation = (permission: string): boolean =>
    permissionsManager.can(Resources.Pronunciation, permission);

  const canUserResponse = (permission): boolean =>
    permissionsManager.can(Resources.UserResponse, permission);

  const canRecordNameBadge = (): boolean =>
    canPronunciation("create:name_badge") &&
    canPronunciation("index:name_badge");

  const canCreateOrgPeerRecording = (ownerSignature: string): boolean =>
    customFeaturesManager.canRecordOrgPeer(ownerSignature) &&
    canPronunciation("create");

  const canCreateSelfRecording = (pronunciation: Pronunciation): boolean =>
    (canRecordNameBadge() && pronunciation?.isHedb) ||
    (canPronunciation("create") && !pronunciation?.isHedb);

  const customDestroy = (): boolean => {
    const customDestroyFeaturePresent = customFeaturesManager.isPresent(
      "recordings_custom_destroy"
    );

    const selfFeatureValuePresent = !!customFeaturesManager
      .getValue("recordings_custom_destroy")
      ?.find((item) => item === "self");

    const featureMetadataKeyPresent = !!customFeaturesManager.getMetadata(
      "self"
    );

    return (
      customDestroyFeaturePresent &&
      selfFeatureValuePresent &&
      featureMetadataKeyPresent
    );
  };

  const canDestroyPronunciation = (pronunciation: Pronunciation): boolean => {
    const customDestroyFeaturePresent = customFeaturesManager.isPresent(
      "recordings_custom_destroy"
    );

    const selfFeatureValuePresent = !!customFeaturesManager
      .getValue("recordings_custom_destroy")
      ?.find((item) => item === "self");

    const featureMetadataKeyPresent = !!customFeaturesManager.getMetadata(
      "self"
    );

    const isSelf =
      pronunciation &&
      pronunciation.relativeSource === RelativeSource.RequesterSelf;

    const isOrgPeer =
      pronunciation &&
      pronunciation.relativeSource === RelativeSource.RequesterPeer;

    const canDeleteSelf =
      canPronunciation("destroy") && canPronunciation("destroy:self");
    const canDeleteOrgPeer =
      canPronunciation("destroy") && canPronunciation("destroy:org_peer");
    const canDeleteHedbAll =
      canPronunciation("destroy") && canPronunciation("destroy:self_hedb_all");

    const condition =
      ((isSelf && canDeleteSelf) || (isOrgPeer && canDeleteOrgPeer)) &&
      !pronunciation.isHedb;

    const condition3 = isSelf && canDeleteHedbAll && pronunciation.isHedb;

    const condition2 =
      customDestroyFeaturePresent &&
      selfFeatureValuePresent &&
      featureMetadataKeyPresent &&
      isSelf;

    return condition || condition2 || condition3;
  };

  const canCreateUserResponse = (ownerSignature: string): boolean =>
    customFeaturesManager.canUserResponse(ownerSignature) &&
    canUserResponse("create");

  const canRestoreSelfPronunciation = (): boolean =>
    canPronunciation("restore") && canPronunciation("restore:self");

  const canRestoreOrgPeerPronunciation = (): boolean =>
    canPronunciation("restore") && canPronunciation("restore:org_peer");

  const canRestore = (pronunciation: Pronunciation): boolean =>
    (canRestoreSelfPronunciation() || canRestoreOrgPeerPronunciation()) &&
    pronunciation?.sourceType === "gpdb";

  const showSelfRecorderAction = (pronunciation: Pronunciation): boolean =>
    canCreateSelfRecording(pronunciation) ||
    canDestroyPronunciation(pronunciation);

  const showRecorderRecordButton = (pronunciation, ownerSignature): boolean => {
    if (pronunciation && pronunciation.isHedb && !canRecordNameBadge())
      return false;

    return (
      canCreateSelfRecording(pronunciation) ||
      canCreateOrgPeerRecording(ownerSignature)
    );
  };
  // methods end

  const context = useMemo(() => {
    return {
      recorderRecordButton: showRecorderRecordButton,
      selfRecorderAction: showSelfRecorderAction,

      restoreOrgPeerPronunciation: canRestoreOrgPeerPronunciation,
      restoreSelfPronunciation: canRestoreSelfPronunciation,
      createUserResponse: canCreateUserResponse,
      destroyPronunciation: canDestroyPronunciation,
      customDestroy: customDestroy,
      createSelfRecording: canCreateSelfRecording,
      createOrgPeerRecording: canCreateOrgPeerRecording,
      recordNameBadge: canRecordNameBadge,
      userResponse: canUserResponse,
      pronunciation: canPronunciation,
      restore: canRestore,
    };
  }, []);

  const can = (name: string, ...rest): boolean => {
    return context[name](...rest);
  };

  const show = can;

  return { can, show } as const;
};

export default useFeaturesManager;
