import React, { useMemo } from "react";
import classNames from "classnames/bind";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import Pronunciation, {
  RelativeSource,
} from "../../../types/resources/pronunciation";
import Name, { NameTypes } from "../../../types/resources/name";
import { UsePronunciationsReturn } from "../../hooks/pronunciations";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";
import styles from "./styles.module.css";
import IFrontController from "../../../types/front-controller";
import { NameOwner } from "gpdb-api-client";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import { UserPermissions } from "../../../types/permissions";
import useOnRecorderClose from "../../hooks/PronunciationsBlock/useOnRecorderClose";
import checkIfNameExist from "../../../core/utils/check-if-name-exists";
import { useNotifications } from "../../hooks/useNotification";
import getDeleteNotificationTag from "../../../core/utils/get-delete-notification-tag";
import { NotificationTags } from "../../../types/notifications";
import Notification from "../Notification";
import NewRecorder from "../Recorder";
import useTranslator from "../../hooks/useTranslator";
import usePopup from "../../kit/Popup/hooks/usePopup";
import Popup from "../../kit/Popup";

type UseNamePartsReturn = {
  nameParts: Name[];
  setNameParts: React.Dispatch<React.SetStateAction<Name[]>>;
};

interface Props {
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions?: UserPermissions;
  nameOwner: NameOwner;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  usePronunciations: UsePronunciationsReturn;
  useNameParts: UseNamePartsReturn;
}

const cx = classNames.bind(styles);

const NameLinesResult = ({
  nameOwner,
  controller,
  termsAndConditions,
  permissions,
  loading,
  setLoading,
  usePronunciations,
  useNameParts,
}: Props): JSX.Element => {
  const customFeatures = useCustomFeatures(controller);
  const { notificationsByTag } = useNotifications();

  const { can } = useFeaturesManager(
    controller.permissions,
    customFeatures,
    permissions
  );

  const { t } = useTranslator(controller);

  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations;

  const { nameParts, setNameParts } = useNameParts;

  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const { isOpen: isRecorderOpen, type: recorderNameType } = recorderState;

  const canCreateRecordingRequest = can("createRecordingRequest");

  const canFindRecordingRequest = can("findRecordingRequest");

  const canUserResponse = can("createUserResponse", nameOwner?.signature);

  const canRecordOrgPeer = can("createOrgPeerRecording", nameOwner?.signature);

  const reloadName = async (type: NameTypes): Promise<void> => {
    const pronunciations = await controller.simpleSearch(
      nameParts.find((n) => n.type === type),
      nameOwner
    );

    updatePronunciationsByType(type, pronunciations);

    setNameParts(
      nameParts
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: checkIfNameExist(name, type, pronunciations.length),
        }))
    );
  };

  const selfRecorderedPronunciation = useMemo((): Pronunciation => {
    const recordings = pronunciations[recorderState.type]?.filter(
      (item) =>
        item.relativeSource === RelativeSource.RequesterSelf ||
        item.relativeSource === RelativeSource.RequesterPeer
    );

    return recordings?.length > 0 ? recordings[0] : null;
  }, [pronunciations, recorderState]);

  const onRecorderClose = useOnRecorderClose({
    controller,
    requesterPeerPronunciation: selfRecorderedPronunciation,
    pronunciations,
    cachedRecordingNameType: recorderState.type,
    customFeaturesManager: customFeatures,
    reload: reloadName,
    setLoading,
    setRecorderClosed,
    setPronunciations,
  });

  const openRecorder = (name, type): void =>
    setRecorderOpen({ name, type, termsAndConditions });

  const showNotifications = (tag: NotificationTags): boolean => {
    const notifications = notificationsByTag(tag);

    return notifications.length > 0;
  };

  const popup = usePopup<HTMLDivElement>();

  return (
    <>
      {nameParts.map((name, index) => (
        <React.Fragment key={name.key}>
          <Popup
            opener={popup.opener}
            ref={popup.popupRef}
            fullWidth
            show={showNotifications(getDeleteNotificationTag(name.type))}
          >
            <Notification tag={getDeleteNotificationTag(name.type)} />
          </Popup>

          <div ref={popup.openerRef}>
            {name.exist ? (
              <NameLine
                pronunciations={pronunciations[name.type]}
                name={name.key}
                type={name.type}
                owner={nameOwner}
                reload={reloadName}
                canRecord={canRecordOrgPeer}
                canUserResponse={canUserResponse} // can be removed and be checked inside the component
                isRecorderOpen={
                  isRecorderOpen && recorderNameType === name.type
                }
                onRecorderClick={openRecorder}
              />
            ) : (
              <AbsentName
                name={name.key}
                type={name.type}
                owner={nameOwner}
                canRecordingRequestCreate={canCreateRecordingRequest} // can be removed and be checked inside the component
                canPronunciationCreate={canRecordOrgPeer}
                canRecordingRequestFind={canFindRecordingRequest} // can be removed and be checked inside the component
                isRecorderOpen={
                  isRecorderOpen && recorderNameType === name.type
                }
                onRecorderClick={openRecorder}
              />
            )}
          </div>

          {isRecorderOpen && !loading && recorderNameType === name.type && (
            <NewRecorder
              name={recorderState.name}
              type={recorderState.type}
              owner={nameOwner}
              onRecorderClose={onRecorderClose}
              pronunciation={selfRecorderedPronunciation}
              termsAndConditions={recorderState.termsAndConditions}
              relativeSource={RelativeSource.RequesterPeer}
            />
          )}

          {index === 0 && <hr className={cx(styles.divider)} />}
        </React.Fragment>
      ))}
      {nameParts.length === 0 && nameOwner?.signature && !loading && (
        <div className={cx(styles.no_result)}>
          {t("no_result_found", "No result found")}
        </div>
      )}
    </>
  );
};

export default NameLinesResult;
