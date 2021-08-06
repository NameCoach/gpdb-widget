import React, { useEffect, useMemo, useState } from "react";
import IFrontController from "../../../types/front-controller";
import FullNamesList, { NameOption, Props as ListProps, } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import useRecorderState, { TermsAndConditions, } from "../../hooks/useRecorderState";
import Recorder from "../Recorder";
import { PermissionsManager } from "gpdb-api-client";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";

interface Props extends ListProps {
  client: IFrontController;
  manager: PermissionsManager;
  name: Omit<NameOption, "key">;
  termsAndConditions?: TermsAndConditions;
}

enum Blocks {
  Pronunciations = "pronunciations",
  MyInfo = "myInfo",
  Invalid = "invalid",
}

const cx = classNames.bind(styles);
const MyInfo = (props: Props) => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const manager = useMemo(() => props.manager, [props.manager]);
  const client = useMemo(() => props.client, [props.client]);
  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const can = (permission) =>
    manager && manager.can(Resources.Pronunciation, permission);

  const canUserResponse = () =>
    manager && manager.can(Resources.UserResponse, "create");

  const canUserRequest = () =>
    manager && manager.can(Resources.RecordingRequest, "create");

  const blockPermissions = useMemo(
    () => ({
      [Blocks.Pronunciations]: can("search"),
      [Blocks.MyInfo]: can("search") && can("create"),
      [Blocks.Invalid]: !(can("search") || can("create")),
    }),
    [manager]
  );

  const onRecorderOpen = () =>
    setRecorderOpen(
      true,
      props.name.value,
      NameTypes.FullName,
      props.termsAndConditions
    );

  useEffect(() => {
    const load = async () => {
      if (!can("search")) return;

      setLoading(true);
      const { fullName } = await client.complexSearch(
        [
          {
            key: props.name.value,
            type: NameTypes.FullName,
          },
        ],
        props.name.owner
      );

      setPronunciation(fullName[0]);
      setLoading(false);
    };

    load();
  }, [props.name, manager]);

  const renderContainer = () => (
    <div className={cx(styles.container)}>
      {props.names.length !== 0 && blockPermissions[Blocks.Pronunciations] && (
        <>
          <div className={cx(styles.title, styles.m_20)}>Pronunciations</div>
          <FullNamesList
            names={props.names}
            onSelect={props.onSelect}
            showLib={can("search")}
            canCreate={can("create")}
            canUserResponse={canUserResponse()}
            canUserRequest={canUserRequest()}
          />
        </>
      )}

      {blockPermissions[Blocks.MyInfo] && (
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
      )}

      {recorderState.isOpen && (
        <Recorder
          name={props.name.value}
          type={NameTypes.FullName}
          owner={props.name.owner}
          onRecorderClose={setRecorderClosed}
          termsAndConditions={props.termsAndConditions}
        />
      )}
    </div>
  );

  const renderError = () => (
    <div className={cx(styles.container)}>
      You can't create or listen to any recordings. Please contact your
      administrator to get this fixed.
    </div>
  );

  return (
    <ControllerContext.Provider value={client}>
      {manager && blockPermissions[Blocks.Invalid]
        ? renderError()
        : renderContainer()}
    </ControllerContext.Provider>
  );
};

export default MyInfo;
