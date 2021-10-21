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
} from "../../hooks/useRecorderState";
import Recorder from "../Recorder";
import { UserPermissions } from "../../../types/permissions";

interface Props {
  name: Omit<NameOption, "key">;
  permissions: UserPermissions;
  controller: IFrontController;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
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

    setPronunciation(fullName.filter((p) => p.nameOwnerCreated)[0]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [props.name, props.controller]);

  const renderContainer = (): JSX.Element => (
    <>
      <div className={cx(styles.row)}>
        <span className={cx(styles.title)}>My info</span>

        <div className={cx(styles.actions)}>
          {loading && <Loader />}
          {!loading && pronunciation && (
            <Player audioSrc={pronunciation.audioSrc} />
          )}
          {!loading && (
            <RecordAction
              active={recorderState.isOpen}
              onClick={onRecorderOpen}
            />
          )}
        </div>
      </div>

      {recorderState.isOpen && (
        <Recorder
          name={props.name.value}
          type={NameTypes.FullName}
          owner={props.name.owner}
          onRecorded={(): Promise<void> => load()}
          onRecorderClose={setRecorderClosed}
          termsAndConditions={props.termsAndConditions}
        />
      )}
    </>
  );

  return renderContainer();
};

export default MyInfo;
