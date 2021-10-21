import React, { useMemo } from "react";
import IFrontController from "../../../../types/front-controller";
import { NameOption } from "../../FullNamesList";
import { TermsAndConditions } from "../../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import FullNamesContainer from "../../FullNamesContainer";
import SingleNameContainer from "../SingleNameContainer";
import NoPermissionsError from "../../NoPermissionsError";
import { UserPermissions } from "../../../../types/permissions";
import ControllerContext from "../../../contexts/controller";
import { DEFAULT_NAME_OWNER } from "../../../../constants";

interface Props {
  client: IFrontController;
  name: string;
  termsAndConditions?: TermsAndConditions;
}

const checkfullName = (name: string): boolean => {
  const _name = name.trim();

  if (_name.includes(" ") || _name.includes(",") || _name.includes("@"))
    return true;

  return false;
};

const Adapter = (props: Props): JSX.Element => {
  const isFullName = checkfullName(props.name);

  const name = {
    key: props.name,
    value: props.name,
    owner: { signature: DEFAULT_NAME_OWNER },
  };

  const names = [name] as NameOption[];

  const client = useMemo(() => props.client, [props.client]);

  const canUserResponseCreate = (): boolean =>
    client.permissions.can(Resources.UserResponse, "create");

  const canPronunciationCreate = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "create");

  const canRecordingRequestCreate = (): boolean =>
    client.permissions.can(Resources.RecordingRequest, "create");

  const canRecordingRequestFind = (): boolean =>
    client.permissions.can(Resources.RecordingRequest, "find");

  const canPronunciationComplexSearch = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "search");

  const canPronunciationSimpleSearch = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "index");

  const canPronunciationSearchBySig = (): boolean =>
    client.permissions.can(Resources.Pronunciation, "search_by_sig");

  const permissions = {
    canUserResponse: { create: canUserResponseCreate() },
    canPronunciation: {
      create: canPronunciationCreate(),
      search: canPronunciationComplexSearch(),
      index: canPronunciationSimpleSearch(),
      search_by_sig: canPronunciationSearchBySig(),
    },
    canRecordingRequest: {
      create: canRecordingRequestCreate(),
      find: canRecordingRequestFind(),
    },
  } as UserPermissions;

  const renderContainer = (): JSX.Element => (
    <div>
      {isFullName && names.length !== 0 && (
        <>
          <FullNamesContainer
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
    <ControllerContext.Provider value={client}>
      {canPronunciationSimpleSearch()
        ? renderContainer()
        : NoPermissionsError()}
    </ControllerContext.Provider>
  );
};

export default Adapter;
