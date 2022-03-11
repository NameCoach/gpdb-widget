import defaultSpec from "./default-spec";
import withCustomAttrsSpec from "./with-custom-attributes";
import { Resources } from "gpdb-api-client";

export const EVENTS = {
  accept: "accept",
  start: "start",
  ready: "ready",
  stop: "stop",
  save: "save",
  fail: "fail",
  customAttrs: "to custom attrs",
};

const getSpec = (controller, owner): { [x: string]: any } => {
  const nameOwner = owner || controller.nameOwnerContext;
  const canCustomAttributesCreate =
    nameOwner.signature === controller.userContext.signature &&
    controller.permissions.can(Resources.CustomAttributes, "save_values") &&
    controller.permissions.can(Resources.CustomAttributes, "retrieve_config") &&
    !controller.permissions.can(Resources.Pronunciation, "create:name_budge") &&
    controller?.customAttributes?.length > 0;

  if (canCustomAttributesCreate)
    return withCustomAttrsSpec({ canCustomAttributesCreate });

  return defaultSpec({ canCustomAttributesCreate });
};

export default getSpec;
