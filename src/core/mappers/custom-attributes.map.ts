import CustomAttribute, {
  AttributePresentation,
} from "../../types/resources/custom-attribute";
import { AttributeConfig } from "gpdb-api-client";

export type CustomAttributeObject = CustomAttribute &
  AttributeConfig & { values?: string[] };

const customAttributesMap = (
  raw: (CustomAttribute & AttributeConfig)[]
): CustomAttributeObject[] => {
  if (!raw || raw.length === 0) return [];

  const defaultValue = (type): boolean | string =>
    type === AttributePresentation.Checkbox ? false : "";

  return raw.map((attribute) => {
    const _attribute: CustomAttributeObject = {
      id: attribute.id,
      value:
        attribute?.value ||
        attribute.metadata?.default_value ||
        defaultValue(attribute.presentation),
      label: attribute.label,
      presentation: attribute.presentation,
    };

    if (_attribute.presentation === AttributePresentation.Dropdown)
      _attribute.values = attribute.metadata?.values;

    return _attribute;
  });
};

export default customAttributesMap;
