import React, { useEffect, useMemo, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption, Props as ListProps } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import styles from "./styles.module.css";
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
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import FullNamesContainer from "../FullNamesContainer";
import NoPermissionsError from "../NoPermissionsError";
import { UserPermissions } from "../../../types/permissions";

interface Props {
  client: IFrontController;
  name: Omit<NameOption, "key">;
  names: NameOption[];
  termsAndConditions?: TermsAndConditions;
}

enum Blocks {
  Pronunciations = "pronunciations",
  MyInfo = "myInfo",
  Invalid = "invalid",
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const client = useMemo(() => props.client, [props.client]);
  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const canPronunciation = (permission): boolean =>
    client.permissions.can(Resources.Pronunciation, permission);

  const canComplexSearch = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "search");

  const canUserResponseCreate = (): boolean =>
    client.permissions.can(Resources.UserResponse, "create");

  const canPronunciationCreate = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "create");

  const canRecordingRequestCreate = (): boolean =>
    client.permissions.can(Resources.RecordingRequest, "create");

  const blockPermissions = useMemo(
    () => ({
      [Blocks.Pronunciations]: canPronunciation("index"),
      [Blocks.MyInfo]: canPronunciation("index") && canPronunciation("create"),
      [Blocks.Invalid]: !canPronunciation("index"),
    }),
    [client.permissions]
  );

  const permissions = {
    canPronunciation: {
      create: canPronunciationCreate(),
      search: canComplexSearch(),
      index: canPronunciation("index"),
    },
    canUserResponse: { create: canUserResponseCreate() },
    canRecordingRequest: { create: canRecordingRequestCreate() },
  } as UserPermissions;

  const onRecorderOpen = (): void =>
    setRecorderOpen(
      true,
      props.name.value,
      NameTypes.FullName,
      props.termsAndConditions
    );

  const load = async (): Promise<void> => {
    if (!canPronunciation("index")) return;

    setLoading(true);
    const fullName = await client.simpleSearch(
      {
        key: props.name.value,
        type: NameTypes.FullName,
      },
      props.name.owner
    );

    setPronunciation(fullName[0]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [props.name, client]);

  const renderContainer = (): JSX.Element => (
    <div className={cx(styles.container)}>
      {props.names.length !== 0 && blockPermissions[Blocks.Pronunciations] && (
        <>
          <div className={cx(styles.title, styles.m_20)}>Pronunciations</div>
          <FullNamesContainer
            names={props.names}
            termsAndConditions={props.termsAndConditions}
            controller={client}
            permissions={permissions}
            byMyInfo
          />
        </>
      )}

      {blockPermissions[Blocks.MyInfo] && (
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
      )}
    </div>
  );

  return (
    <ControllerContext.Provider value={client}>
      {blockPermissions[Blocks.Invalid]
        ? NoPermissionsError()
        : renderContainer()}
    </ControllerContext.Provider>
  );
};

export default MyInfo;
