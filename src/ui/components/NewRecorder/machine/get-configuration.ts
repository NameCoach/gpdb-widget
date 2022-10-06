import { Configuration } from "../types/configuration";
import { config as DefaultConfig } from "./configurations/default";
import { config as WithCustomAttributesConfig } from "./configurations/with-custom-attributes";

interface Options {
  canCustomAttributesCreate?: boolean;
  themeIsDefault: boolean;
}

const getConfiguration = ({
  canCustomAttributesCreate,
  themeIsDefault = true,
}: Options): Configuration => {
  if (canCustomAttributesCreate && themeIsDefault)
    return WithCustomAttributesConfig;

  return DefaultConfig;
};

export default getConfiguration;
