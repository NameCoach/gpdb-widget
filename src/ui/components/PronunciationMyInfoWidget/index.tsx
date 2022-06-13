import React, { useCallback, useContext, useMemo } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import FullNamesContainer from "../FullNamesContainer";
import NoPermissionsError from "../NoPermissionsError";
import { UserPermissions } from "../../../types/permissions";
import MyInfo from "../MyInfo";
import loadT from "../../hooks/LoadT";
import loadCustomFeatures from "../../hooks/loadCustomFatures";
import { HtmlComponents } from "../../customFeaturesManager";

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
  const styleContext = useContext(StyleContext);
  const t = loadT(client?.preferences?.translations);
  const customFeatures = loadCustomFeatures(
    client?.preferences?.custom_features
  );

  const canPronunciation = useCallback(
    (permission): boolean =>
      client.permissions.can(Resources.Pronunciation, permission),
    [client.permissions]
  );

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
    [canPronunciation]
  );

  // TODO: refactor to get rid of later
  const permissions = {
    canPronunciation: {
      create: canPronunciation("create"),
      search: canPronunciation("search"),
      index: canPronunciation("index"),
      share: canPronunciation("share"),
      createNameBadge: canPronunciation("create:name_badge"),
      indexNameBadge: canPronunciation("index:name_badge"),
      restoreSelf:
        canPronunciation("restore") && canPronunciation("restore:self"),
      restoreOrgPeer:
        canPronunciation("restore") && canPronunciation("restore:org_peer"),
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
          />
          {customFeatures.renderCustomComponent(HtmlComponents.UnderMyInfo)}
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
