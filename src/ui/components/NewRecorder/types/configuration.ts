import { IConfiguration as IDefaultConfiguration } from "../machine/configurations/default";
import { IConfiguration as IWithCustomAttributesConfig } from "../machine/configurations/with-custom-attributes";

export type Configuration = IDefaultConfiguration | IWithCustomAttributesConfig;
