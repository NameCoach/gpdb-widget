import CustomAttribute, {
  AttributePresentation,
} from "../../types/resources/custom-attribute";
import { AttributeConfig } from "gpdb-api-client";

type Attribute = CustomAttribute & AttributeConfig;
type CustomAttributesValue = string | boolean;

export type CustomAttributeObject = Attribute & { values?: string[] };

const getValue = (attribute: Attribute): CustomAttributesValue => {
  const value = attribute?.value;
  const defaultValue = attribute?.metadata?.default_value;

  if (attribute.presentation === AttributePresentation.Checkbox) {
    const checkboxDefaultValue = defaultValue || false;

    return value === undefined ? checkboxDefaultValue : value;
  }

  return value || defaultValue || "";
};

const customAttributesMap = (raw: Attribute[]): CustomAttributeObject[] => {
  if (!raw || raw.length === 0) return [];

  return raw.map((attribute) => {
    const _attribute: CustomAttributeObject = {
      id: attribute.id,
      value: getValue(attribute),
      label: attribute.label,
      presentation: attribute.presentation,
      metadata: attribute.metadata,
    };

    if (_attribute.presentation === AttributePresentation.Dropdown)
      _attribute.values = attribute.metadata?.values;

    return _attribute;
  });
};

export default customAttributesMap;
