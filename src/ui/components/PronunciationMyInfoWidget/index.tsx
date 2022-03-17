import React, { useContext, useMemo } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { ErrorHandler, TermsAndConditions } from "../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import FullNamesContainer from "../FullNamesContainer";
import NoPermissionsError from "../NoPermissionsError";
import { UserPermissions } from "../../../types/permissions";
import MyInfo from "../MyInfo";
import loadT from "../../hooks/LoadT";
import loadCustomFeatures from "../../hooks/loadCustomFatures";

interface Props {
  client: IFrontController;
  name: Omit<NameOption, "key">;
  names: NameOption[];
  termsAndConditions?: TermsAndConditions;
  errorHandler?: ErrorHandler;
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
  const styleContext = useContext(StyleContext);
  const t = loadT(client?.preferences?.translations);
  const customFeatures = loadCustomFeatures(
    client?.preferences?.custom_features
  );

  const cannotPronunciation = (permission): boolean =>
    client.permissions.cannot(Resources.Pronunciation, permission);

  const canPronunciation = (permission): boolean =>
    client.permissions.can(Resources.Pronunciation, permission);

  const canUserResponse = (permission): boolean =>
    client.permissions.can(Resources.UserResponse, permission);

  const canRecordingRequest = (permission): boolean =>
    client.permissions.can(Resources.RecordingRequest, permission);

  const canCustomAttributes = (permission): boolean =>
    client.permissions.can(Resources.CustomAttributes, permission);

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
      create: {
        self: canPronunciation("create") && !cannotPronunciation("create:self"),
        orgPeer:
          canPronunciation("create") && !cannotPronunciation("create:org_peer"),
      },
      search: canPronunciation("search"),
      index: canPronunciation("index"),
      share: canPronunciation("share"),
      createNameBadge: canPronunciation("create:name_badge"),
      indexNameBadge: canPronunciation("index:name_badge"),
    },
    canUserResponse: { create: canUserResponse("create") },
    canRecordingRequest: {
      create: canRecordingRequest("create"),
      find: canRecordingRequest("find"),
    },
    canCustomAttributes: {
      saveValues: canCustomAttributes("save_values"),
      retrieveConfig: canCustomAttributes("retrieve_config"),
    },
  } as UserPermissions;

  const renderContainer = (): JSX.Element => (
    <div className={cx(styles.container)}>
      {props.names.length !== 0 && blockPermissions[Blocks.Pronunciations] && (
        <>
          <div className={cx(styles.title, styles.m_20)}>
            {t("pronunciations_section_name", "Pronunciations")}
          </div>
          <FullNamesContainer
            names={props.names}
            termsAndConditions={props.termsAndConditions}
            controller={client}
            permissions={permissions}
          />
        </>
      )}

      {blockPermissions[Blocks.MyInfo] && (
        <>
          <hr className={styles.divider} />
          <MyInfo
            controller={client}
            name={props.name}
            permissions={permissions}
            termsAndConditions={props.termsAndConditions}
            errorHandler={props.errorHandler}
          />
        </>
      )}
    </div>
  );

  return (
    <StyleContext.Provider
      value={{
        displayRecorderSavingMessage:
          styleContext?.displayRecorderSavingMessage,
        customFeatures,
        t,
      }}
    >
      <ControllerContext.Provider value={client}>
        {blockPermissions[Blocks.Invalid]
          ? NoPermissionsError()
          : renderContainer()}
      </ControllerContext.Provider>
    </StyleContext.Provider>
  );
};

export default PronunciationMyInfoWidget;
