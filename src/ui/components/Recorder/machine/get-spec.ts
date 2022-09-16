import defaultSpec from "./default-spec";
import withCustomAttrsSpec from "./with-custom-attributes";

interface Options {
  canCustomAttributesCreate?: boolean;
  themeIsDefault: boolean;
}

const getSpec = ({
  canCustomAttributesCreate,
  themeIsDefault = true,
}: Options): { [x: string]: any } => {
  if (canCustomAttributesCreate && themeIsDefault)
    return withCustomAttrsSpec({ canCustomAttributesCreate });

  return defaultSpec({ canCustomAttributesCreate });
};

export default getSpec;
