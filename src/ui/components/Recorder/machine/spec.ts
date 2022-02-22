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
    controller.permissions.can(Resources.CustomAttributes, "save_values") &&
    controller.permissions.can(Resources.CustomAttributes, "retrieve_config") &&
    controller?.customAttributes?.length > 0 &&
    nameOwner.signature === controller.userContext.signature;

  if (canCustomAttributesCreate)
    return withCustomAttrsSpec({ canCustomAttributesCreate });

  return defaultSpec({ canCustomAttributesCreate });
};

export default getSpec;
