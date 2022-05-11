import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import FullNamesList, { NameOption } from "../FullNamesList";
import Pronunciation, {
  RelativeSource,
} from "../../../types/resources/pronunciation";
import Name, { NameTypes } from "../../../types/resources/name";
import { usePronunciations } from "../../hooks/pronunciations";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";
import styles from "../Container/styles.module.css";
import Recorder from "../Recorder";
import IFrontController from "../../../types/front-controller";
import { UserPermissions } from "../../../types/permissions";
import { NameOwner } from "gpdb-api-client";
import CustomAttributes from "../CustomAttributes";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import StyleContext from "../../contexts/style";
import RestorePronunciationNotification from "../Notification/RestorePronunciationNotification";
import { useNotifications } from "../../hooks/useNotification";
import { RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY } from "../../../constants";
import { nameExist } from "./helper-methods";
import { RecorderCloseOptions } from "../Recorder/types/handlersTypes";
import { ConstantOverrides } from "../../customFeaturesManager";

interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions: UserPermissions;
}

const cx = classNames.bind(styles);

const FullNamesContainer = (props: Props): JSX.Element => {
  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();
  const { setNotification } = useNotifications();

  const { isOpen: isRecorderOpen } = recorderState;
  const [currentPronunciation, setCurrent] = useState<Pronunciation>(null);
  const [loading, setLoading] = useState(false);
  const [nameParts, setNameParts] = useState<Name[]>([]);
  const [nameOwner, setNameOwner] = useState<NameOwner>(props.names[0].owner);

  const fullNamesObject = useRef([]);
  const { customFeatures } = useContext(StyleContext);

  const searchBySig = async (name: NameOption): Promise<void> => {
    const nameOwner = { signature: name.value, email: name.value };
    const [names, result] = await props.controller.searchBySig(nameOwner);

    const fullName = names.find((n) => n.type === NameTypes.FullName);

    fullNamesObject.current =
      typeof fullName === "object"
        ? [{ key: name.key, value: fullName.key, owner: nameOwner }]
        : [name];

    const _current = result.fullName[0];
    setCurrent(_current);

    if (_current) return setLoading(false);

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);

    setLoading(false);
  };

  const sendAnalytics = (name: NameOption): PromiseLike<void> => {
    const parsedNames = props.controller.nameParser.parse(name.value);
    const names = Object.values(NameTypes)
      .filter((type) => parsedNames[type])
      .map((type) => ({
        key: parsedNames[type],
        type,
      }));

    return props.controller.sendAnalytics(
      AnalyticsEventType.Available,
      Object.values(names)
    );
  };

  const complexSearch = async (name: NameOption): Promise<void> => {
    fullNamesObject.current = [name];
    const parsedNames = props.controller.nameParser.parse(name.value);
    const names = Object.values(NameTypes)
      .filter((type) => parsedNames[type])
      .map((type) => ({
        key: parsedNames[type],
        type,
      }));

    const result = await props.controller.complexSearch(names, name.owner);

    const _current = result.fullName[0];

    setCurrent(_current);

    if (_current?.nameOwnerCreated) return setLoading(false);

    setNameParts(
      names
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: result[name.type].length !== 0,
        }))
    );

    setPronunciations(result);

    setLoading(false);
  };

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);

    setNameOwner(name.owner);

    if (
      name.value.includes("@") &&
      props.permissions.canPronunciation.search_by_sig
    ) {
      await searchBySig(name);
    } else if (props.permissions.canPronunciation.search) {
      await complexSearch(name)
        .then(() => sendAnalytics(name))
        .catch((e) => console.log(e));
    } else {
      const pronunciations = await props.controller.simpleSearch(
        {
          key: name.value,
          type: NameTypes.FullName,
        },
        name.owner
      );

      setCurrent(pronunciations[0]);
      setLoading(false);
    }
  };

  const onSelect = (name: NameOption): Promise<void> => {
    const owner = props.names.find((n) => n.key === name.key).owner;

    setNameParts([]);

    return loadName({ ...name, owner });
  };

  const reloadName = async (type: NameTypes): Promise<void> => {
    const pronunciations = await props.controller.simpleSearch(
      nameParts.find((n) => n.type === type),
      nameOwner
    );

    updatePronunciationsByType(type, pronunciations);

    setNameParts(
      nameParts
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: nameExist(name, type, pronunciations.length),
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

  const onRecorderClose = async (
    option: RecorderCloseOptions
  ): Promise<void> => {
    if (option === RecorderCloseOptions.CANCEL) return setRecorderClosed();

    const pronunciationId = selfRecorderedPronunciation?.id;
    const cachedRecordingNameType = recorderState.type;

    await reloadName(cachedRecordingNameType);

    if (
      option === RecorderCloseOptions.DELETE &&
      props.permissions.canPronunciation.restoreOrgPeer
    ) {
      const notificationId = new Date().getTime();

      const onRestorePronunciationClick = async (): Promise<void> => {
        const success = await props.controller.restore(pronunciationId);
        if (success) return await reloadName(cachedRecordingNameType);

        setNotification();
      };

      setNotification({
        id: notificationId,
        content: (
          <RestorePronunciationNotification
            id={notificationId}
            onClick={onRestorePronunciationClick}
          />
        ),
        autoclose:
          customFeatures.getValue(ConstantOverrides.RestorePronunciationTime) ||
          RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY,
      });
    }

    setRecorderClosed();
  };

  const openRecorder = (name, type): void =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  const canRecordOrgPeer = (ownerSignature: string): boolean =>
    customFeatures.canRecordOrgPeer(ownerSignature) &&
    props.permissions.canPronunciation.create;

  const canUserResponse = (ownerSignature: string): boolean =>
    customFeatures.canUserResponse(ownerSignature) &&
    props.permissions.canUserResponse.create;

  useEffect(() => {
    loadName(props.names[0]);
  }, [props.names]);

  return (
    <>
      <FullNamesList
        names={props.names}
        onSelect={onSelect}
        value={currentPronunciation}
        loading={loading}
        hideActions={
          props.permissions.canPronunciation.search &&
          !currentPronunciation &&
          nameParts.length > 0
        }
      />

      {currentPronunciation &&
        currentPronunciation.customAttributes &&
        currentPronunciation.customAttributes.length > 0 && (
          <CustomAttributes
            attributes={currentPronunciation.customAttributes}
            disabled
          />
        )}

      {props.permissions.canPronunciation.search && !isRecorderOpen && (
        <>
          {nameParts.map((name, index) => (
            <React.Fragment key={name.key}>
              {name.exist ? (
                <NameLine
                  pronunciations={pronunciations[name.type]}
                  name={name.key}
                  type={name.type}
                  owner={nameOwner}
                  reload={reloadName}
                  canRecord={canRecordOrgPeer(nameOwner.signature)}
                  pronunciationNameClass="ft-17"
                  canUserResponse={canUserResponse(nameOwner.signature)}
                  onRecorderClick={openRecorder}
                />
              ) : (
                <AbsentName
                  canRecordingRequestCreate={
                    props.permissions.canRecordingRequest.create
                  }
                  canPronunciationCreate={canRecordOrgPeer(nameOwner.signature)}
                  canRecordingRequestFind={
                    props.permissions.canRecordingRequest.find
                  }
                  name={name.key}
                  type={name.type}
                  owner={nameOwner}
                  pronunciationNameClass="ft-17"
                  onRecorderClick={openRecorder}
                />
              )}

              {index === 0 && (
                <hr className={cx(styles.divider, styles.invisible)} />
              )}
            </React.Fragment>
          ))}
        </>
      )}

      {props.permissions.canPronunciation.search &&
        isRecorderOpen &&
        !loading && (
          <Recorder
            name={recorderState.name}
            type={recorderState.type}
            owner={nameOwner}
            onRecorderClose={onRecorderClose}
            pronunciation={selfRecorderedPronunciation}
            termsAndConditions={recorderState.termsAndConditions}
          />
        )}
    </>
  );
};

export default FullNamesContainer;
