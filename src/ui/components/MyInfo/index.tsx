import React, { useEffect, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import useRecorderState, {
  TermsAndConditions,
  ErrorHandler,
} from "../../hooks/useRecorderState";
import Recorder from "../Recorder";
import { UserPermissions } from "../../../types/permissions";
import ShareAudioUrlAction, { CopyButton } from "../Actions/ShareAudioUrl";
import CustomAttributes from "../CustomAttributes";
import CollapsableAction from "../Actions/Collapsable";

interface Props {
  name: Omit<NameOption, "key">;
  permissions: UserPermissions;
  controller: IFrontController;
  termsAndConditions?: TermsAndConditions;
  errorHandler?: ErrorHandler;
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [collapsableActive, setCollapsable] = useState(false);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const onRecorderOpen = (): void =>
    setRecorderOpen(
      true,
      props.name.value,
      NameTypes.FullName,
      props.termsAndConditions
    );

  const onCollapsable = (): void => setCollapsable((value) => !value);

  const load = async (): Promise<void> => {
    if (!props.permissions.canPronunciation.index) return;

    setLoading(true);
    const fullName = await props.controller.simpleSearch(
      {
        key: props.name.value,
        type: NameTypes.FullName,
      },
      props.name.owner
    );

    setPronunciation(fullName.find((p) => p.nameOwnerCreated));
    setLoading(false);
  };

  const onRecorderClose = async (): Promise<void> => {
    await load();
    setRecorderClosed();
  };

  const onCustomAttributesSaved = async (): Promise<void> => {
    await load();
    setCollapsable(false);
  };

  useEffect(() => {
    load();
  }, [props.name, props.controller]);

  const getCopyButtons = (pronunciation): CopyButton[] => {
    const result = [{ url: pronunciation.audioSrc, text: "Audio URL" }];

    if (pronunciation.nameBadgeLink)
      result.push({ url: pronunciation.nameBadgeLink, text: "NameBadge Link" });

    return result;
  };

  const canCreateSelfRecording = (): boolean =>
    (props.permissions.canPronunciation.createNameBadge &&
      props.permissions.canPronunciation.indexNameBadge &&
      pronunciation?.isHedb) ||
    (props.permissions.canPronunciation.create && !pronunciation?.isHedb);

  const displayCustomAttributes = (): boolean =>
    pronunciation &&
    pronunciation.customAttributes &&
    pronunciation.customAttributes.length > 0;

  const customAttributesDisabled = (): boolean => {
    console.log(
      props.permissions.canCustomAttributes.saveValues,
      props.permissions.canCustomAttributes.retrieveConfig,
      pronunciation?.isHedb
    );
    return (
      !props.permissions.canCustomAttributes.saveValues ||
      !props.permissions.canCustomAttributes.retrieveConfig ||
      pronunciation?.isHedb
    );
  };

  const renderContainer = (): JSX.Element => (
    <>
      <div>
        <div className={cx(styles.row)}>
          <span className={cx(styles.title)}>My info</span>

          <div className={cx(styles.actions)}>
            {loading && <Loader />}

            {!loading &&
              props.permissions.canPronunciation.share &&
              pronunciation && (
                <ShareAudioUrlAction buttons={getCopyButtons(pronunciation)} />
              )}

            {!loading && displayCustomAttributes() && (
              <CollapsableAction
                active={collapsableActive}
                onClick={onCollapsable}
              />
            )}

            {!loading && pronunciation && (
              <Player
                audioSrc={pronunciation.audioSrc}
                audioCreator={pronunciation.audioCreator}
              />
            )}

            {!loading && canCreateSelfRecording() && (
              <RecordAction
                active={recorderState.isOpen}
                onClick={onRecorderOpen}
              />
            )}
          </div>
        </div>

        {pronunciation?.phoneticSpelling && (
          <div className={styles.phonetic}>
            {pronunciation.phoneticSpelling}
          </div>
        )}
      </div>

      {!loading && displayCustomAttributes() && collapsableActive && (
        <CustomAttributes
          attributes={pronunciation.customAttributes}
          disabled={customAttributesDisabled()}
          noBorder
          onCustomAttributesSaved={onCustomAttributesSaved}
          onBack={onCollapsable}
        />
      )}

      {recorderState.isOpen && (
        <Recorder
          name={props.name.value}
          type={NameTypes.FullName}
          owner={props.name.owner}
          onRecorderClose={onRecorderClose}
          termsAndConditions={props.termsAndConditions}
          errorHandler={props.errorHandler}
        />
      )}
    </>
  );

  return renderContainer();
};

export default MyInfo;
