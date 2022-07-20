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
import CustomAttributes from "../CustomAttributes";
import styles from "./styles.module.css";
import Recorder from "../Recorder";
import IFrontController from "../../../types/front-controller";
import { NameOwner } from "gpdb-api-client";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import { nameExist } from "./helper-methods";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import { UserPermissions } from "../../../types/permissions";
import useOnRecorderClose from "../../hooks/PronunciationsBlock/useOnRecorderClose";
import StyleContext from "../../contexts/style";
import useTranslator from "../../hooks/useTranslator";

interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions?: UserPermissions;
}

const cx = classNames.bind(styles);

const PronunciationsBlock = (props: Props): JSX.Element => {
  const customFeatures = useCustomFeatures(props.controller);
  const styleContext = useContext(StyleContext);

  const t = useTranslator(props.controller, styleContext);

  const { can } = useFeaturesManager(
    props.controller.permissions,
    customFeatures
  );

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

  const { isOpen: isRecorderOpen } = recorderState;

  const [currentPronunciation, setCurrent] = useState<Pronunciation>(null);
  const [loading, setLoading] = useState(false);
  const [nameParts, setNameParts] = useState<Name[]>([]);
  const [nameOwner, setNameOwner] = useState<NameOwner>(props.names[0].owner);

  const fullNamesObject = useRef([]);

  const permissions = props.permissions;

  const canComplexSearch = can("pronunciation", "search");
  const canSearchBySig = can("pronunciation", "search_by_sig");
  const canCreateRecordingRequest =
    permissions?.canRecordingRequest.create || can("createRecordingRequest");
  const canFindRecordingRequest = can("findRecordingRequest");

  const canUserResponse = useMemo(
    () =>
      permissions?.canUserResponse?.create ||
      can("createUserResponse", nameOwner),
    [nameOwner, props.permissions]
  );

  const canRecordOrgPeer = useMemo(
    () =>
      permissions?.canPronunciation?.create ||
      can("createOrgPeerRecording", nameOwner),
    [nameOwner, props.permissions]
  );

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

    if (name.value.includes("@") && canSearchBySig) {
      await searchBySig(name);
    } else if (canComplexSearch) {
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

  const onRecorderClose = useOnRecorderClose({
    controller: props.controller,
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
    setRecorderOpen(true, name, type, props.termsAndConditions);

  useEffect(() => {
    loadName(props.names[0]);
  }, [props.names]);

  return (
    <>
      <div className={cx(styles.title, styles.m_10)}>
        {t("pronunciations_section_name", "Pronunciations")}
      </div>
      <FullNamesList
        names={props.names}
        onSelect={onSelect}
        value={currentPronunciation}
        loading={loading}
        hideFullName={
          canComplexSearch && !currentPronunciation && nameParts.length > 0
        }
      />

      {!loading &&
        currentPronunciation &&
        currentPronunciation.customAttributes &&
        currentPronunciation.customAttributes.length > 0 && (
          <CustomAttributes
            attributes={currentPronunciation.customAttributes}
            disabled
          />
        )}

      {canComplexSearch && !isRecorderOpen && !currentPronunciation && (
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
                  canRecord={canRecordOrgPeer}
                  pronunciationNameClass="ft-17"
                  canUserResponse={canUserResponse}
                  onRecorderClick={openRecorder}
                />
              ) : (
                <AbsentName
                  canRecordingRequestCreate={canCreateRecordingRequest}
                  canPronunciationCreate={canRecordOrgPeer}
                  canRecordingRequestFind={canFindRecordingRequest}
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

      {canComplexSearch && isRecorderOpen && !loading && (
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

export default PronunciationsBlock;
