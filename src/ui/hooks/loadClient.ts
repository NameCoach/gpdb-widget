import {
  Client,
  Configuration,
  Application,
  NameOwner,
  User,
} from "gpdb-api-client";
import { useMemo } from "react";
import Credentials from "../../types/credentials";
import { ANALYTICS_API_URL, GPDB_API_URL } from "../../constants";
import IFrontController from "../../types/front-controller";
import FrontController from "../../core/front.controller";
import NameParser from "../../types/name-parser";

export default function loadClient(
  credentials: Credentials,
  application: Application,
  nameOwnerContext: NameOwner,
  userContext: User,
  nameParser?: NameParser
): IFrontController {
  const initialization = () => {
    let configuration: Configuration;

    if (credentials instanceof Configuration) configuration = credentials;
    else if ("accessKeyId" in credentials)
      configuration = new Configuration({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        apiUrl: GPDB_API_URL,
        analyticsApiUrl: ANALYTICS_API_URL,
      });

    const client = new Client(application, configuration);
    return new FrontController(
      client,
      nameOwnerContext,
      userContext,
      nameParser
    );
  };

  return useMemo(initialization, [
    credentials,
    application,
    nameOwnerContext,
    userContext,
    nameParser,
  ]);
}
