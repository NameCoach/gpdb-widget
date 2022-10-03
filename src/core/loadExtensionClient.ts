import {
  Client,
  Configuration,
  Application,
  NameOwner,
  User,
} from "gpdb-api-client";

import NameParser from "../types/name-parser";
import FrontController from "./front.controller";

export default function loadExtensionClient(
  configuration: Configuration,
  application: Application,
  nameOwnerContext: NameOwner,
  userContext: User,
  nameParser?: NameParser
): FrontController {
  const client = new Client(application, configuration);
  return new FrontController(client, nameOwnerContext, userContext, nameParser);
}
