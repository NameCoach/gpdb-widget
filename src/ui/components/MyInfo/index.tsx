import React, { useEffect, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "../PronunciationMyInfoWidget/styles.module.css";
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

  useEffect(() => {
    load();
  }, [props.name, props.controller]);

  const getCopyButtons = (pronunciation): CopyButton[] => {
    const result = [{ url: pronunciation.audioSrc, text: "Audio URL" }];

    if (pronunciation.nameBadgeLink)
      result.push({ url: pronunciation.nameBadgeLink, text: "NameBadge Link" });

    return result;
  };

  const renderContainer = (): JSX.Element => (
    <>
      <div className={cx(styles.row)}>
        <span className={cx(styles.title)}>My info</span>
        {pronunciation?.phoneticSpelling && (
          <span className={styles.phonetic}>
            {pronunciation.phoneticSpelling}
          </span>
        )}

        <div className={cx(styles.actions)}>
          {loading && <Loader />}

          {!loading &&
            props.permissions.canPronunciation.share &&
            pronunciation && (
              <ShareAudioUrlAction buttons={getCopyButtons(pronunciation)} />
            )}

          {!loading &&
            pronunciation &&
            pronunciation.customAttributes &&
            pronunciation.customAttributes.length > 0 && (
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

          {!loading && (
            <RecordAction
              active={recorderState.isOpen}
              onClick={onRecorderOpen}
            />
          )}
        </div>
      </div>

      {!loading &&
        pronunciation &&
        pronunciation.customAttributes &&
        pronunciation.customAttributes.length > 0 &&
        collapsableActive && (
          <CustomAttributes
            attributes={pronunciation.customAttributes}
            disabled
          />
        )}

      {recorderState.isOpen && (
        <Recorder
          name={props.name.value}
          type={NameTypes.FullName}
          owner={props.name.owner}
          onRecorded={(): Promise<void> => load()}
          onRecorderClose={setRecorderClosed}
          termsAndConditions={props.termsAndConditions}
          errorHandler={props.errorHandler}
        />
      )}
    </>
  );

  return renderContainer();
};

export default MyInfo;
