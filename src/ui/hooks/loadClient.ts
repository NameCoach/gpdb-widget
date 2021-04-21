import { useMemo } from "react";
import { Client, Configuration } from "gpdb-api-client";
import Credentials from "../../types/credentials";
import Application from "gpdb-api-client/build/main/types/input/application";
import { ANALYTICS_API_URL, GPDB_API_URL } from "../../constants";
import IFrontController from "../../types/front-controller";
import FrontController from "../../core/front.controller";
import NameOwner from "gpdb-api-client/build/main/types/input/name-owner";
import User from "gpdb-api-client/build/main/types/input/user";

export default function loadClient(
  credentials: Credentials,
  application: Application,
  nameOwnerContext: NameOwner,
  userContext: User
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
    return new FrontController(client, nameOwnerContext, userContext);
  };

  return useMemo(initialization, [
    credentials,
    application,
    nameOwnerContext,
    userContext,
  ]);
}
