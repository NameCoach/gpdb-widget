import React, { useContext, useMemo } from "react";
import IFrontController from "../../../../types/front-controller";
import { NameOption } from "../../FullNamesList";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import PronunciationsBlock from "../../PronunciationsBlock";
import SingleNameContainer from "../SingleNameContainer";
import NoPermissionsError from "../../NoPermissionsError";
import { UserPermissions } from "../../../../types/permissions";
import ControllerContext from "../../../contexts/controller";
import { DEFAULT_NAME_OWNER } from "../../../../constants";
import StyleContext from "../../../contexts/style";
import useTranslator from "../../../hooks/useTranslator";
import useCustomFeatures from "../../../hooks/useCustomFeatures";

interface Props {
  client: IFrontController;
  name: string;
  termsAndConditions?: TermsAndConditions;
}

const checkFullName = (name: string): boolean => {
  const _name = name.trim();

  return _name.includes(" ") || _name.includes(",") || _name.includes("@");
};

const Adapter = (props: Props): JSX.Element => {
  const isFullName = checkFullName(props.name);
  const nameIsEmail = props.name.includes("@");
  const ownerSignature = nameIsEmail ? props.name : DEFAULT_NAME_OWNER;

  const name = {
    key: props.name,
    value: props.name,
    owner: { signature: ownerSignature },
  };
  const names = [name] as NameOption[];

  const client = useMemo(() => props.client, [props.client]);

  const styleContext = useContext(StyleContext);

  const t = useTranslator(client, styleContext);

  const customFeatures = useCustomFeatures(client, styleContext);

  const canUserResponse = (permissions): boolean =>
    client.permissions.can(Resources.UserResponse, permissions);

  const canPronunciation = (permissions): boolean =>
    client.permissions.can(Resources.Pronunciation, permissions);

  const canRecordingRequest = (permissions): boolean =>
    client.permissions.can(Resources.RecordingRequest, permissions);

  const permissions = {
    canUserResponse: {
      create: nameIsEmail ? canUserResponse("create") : false,
    },
    canPronunciation: {
      create: nameIsEmail ? canPronunciation("create") : false,
      search: canPronunciation("search"),
      index: canPronunciation("index"),
      search_by_sig: canPronunciation("search_by_sig"),
    },
    canRecordingRequest: {
      create: nameIsEmail ? canRecordingRequest("create") : false,
      find: nameIsEmail ? canRecordingRequest("find") : false,
    },
    canCustomAttributes: {
      save_values: false, // this will not work for FullnamesContainer !!!???
    },
  } as UserPermissions;

  const renderContainer = (): JSX.Element => (
    <div>
      {isFullName && names.length !== 0 && (
        <>
          <PronunciationsBlock
            names={names}
            termsAndConditions={props.termsAndConditions}
            permissions={permissions}
            controller={client}
          />
        </>
      )}

      {!isFullName && (
        <SingleNameContainer
          name={name}
          termsAndConditions={props.termsAndConditions}
          permissions={permissions}
          controller={client}
        />
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
        {canPronunciation("index") ? renderContainer() : NoPermissionsError()}
      </ControllerContext.Provider>
    </StyleContext.Provider>
  );
};

export default Adapter;
