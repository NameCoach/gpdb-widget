import React, { useMemo } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import FullNamesContainer from "../FullNamesContainer";
import NoPermissionsError from "../NoPermissionsError";
import { UserPermissions } from "../../../types/permissions";
import MyInfo from "../MyInfo";

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

const PronunciationMyInfoWidget = (props: Props): JSX.Element => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const client = useMemo(() => props.client, [props.client]);

  const canPronunciation = (permission): boolean =>
    client.permissions.can(Resources.Pronunciation, permission);

  const canUserResponse = (permission): boolean =>
    client.permissions.can(Resources.UserResponse, permission);

  const canRecordingRequest = (permission): boolean =>
    client.permissions.can(Resources.RecordingRequest, permission);

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
      create: canPronunciation("create"),
      search: canPronunciation("search"),
      index: canPronunciation("index"),
      share: canPronunciation("share"),
    },
    canUserResponse: { create: canUserResponse("create") },
    canRecordingRequest: {
      create: canRecordingRequest("create"),
      find: canRecordingRequest("find"),
    },
  } as UserPermissions;

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
        <MyInfo
          controller={client}
          name={props.name}
          permissions={permissions}
          termsAndConditions={props.termsAndConditions}
        />
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

export default PronunciationMyInfoWidget;
