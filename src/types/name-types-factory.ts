import { NameTypes } from "./resources/name";
import { TargetTypeSig } from "gpdb-api-client";

export default {
  [NameTypes.FirstName]: TargetTypeSig.FirstName,
  [NameTypes.LastName]: TargetTypeSig.LastName,
  [NameTypes.FullName]: TargetTypeSig.FullName,
};
