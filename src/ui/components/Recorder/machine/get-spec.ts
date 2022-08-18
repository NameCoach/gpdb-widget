import defaultSpec from "./default-spec";
import withCustomAttrsSpec from "./with-custom-attributes";

interface Options {
  canCustomAttributesCreate?: boolean;
}

const getSpec = ({
  canCustomAttributesCreate,
}: Options): { [x: string]: any } => {
  if (canCustomAttributesCreate)
    return withCustomAttrsSpec({ canCustomAttributesCreate });

  return defaultSpec({ canCustomAttributesCreate });
};

export default getSpec;
