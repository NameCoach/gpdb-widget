import {
  Attribute,
  AttributePresentation,
  CustomAttributeObject,
  CustomAttributeValue,
  MultipleCheckboxField,
} from "../../types/resources/custom-attribute";

const CheckboxValueMapper = (value) => value === true;
const DropdownValueMapper = (value) => value;
const RadioValueMapper = DropdownValueMapper;
const TextboxValueMapper = (value) => value?.toString() || "";
const TextareaValueMapper = TextboxValueMapper;
const MultipleCheckboxMapper = (value) =>
  value.reduce(() => {
    return Object.assign(
      {},
      ...Array.from(value, (item: MultipleCheckboxField) => ({
        [item.id]: String(item.value || false),
      }))
    );
  }, {});

const MAPPERS = {
  [AttributePresentation.Checkbox]: CheckboxValueMapper,
  [AttributePresentation.Dropdown]: DropdownValueMapper,
  [AttributePresentation.Textarea]: TextareaValueMapper,
  [AttributePresentation.Textbox]: TextboxValueMapper,
  [AttributePresentation.Radio]: RadioValueMapper,
  [AttributePresentation.MultipleCheckbox]: MultipleCheckboxMapper,
};

export const valueMapperFunc = (presentation) => (value) => {
  return MAPPERS[presentation](value);
};

const getValue = ({
  value,
  metadata,
  presentation,
}: Pick<
  Attribute,
  "presentation" | "value" | "metadata"
>): CustomAttributeValue => {
  const defaultValue = metadata?.default_value;

  if (presentation === AttributePresentation.Checkbox) {
    const checkboxDefaultValue = defaultValue || false;

    return value === undefined ? checkboxDefaultValue : value;
  }

  if (presentation === AttributePresentation.MultipleCheckbox) {
    return metadata?.values.map((item) => {
      return { ...item, value: value ? value[item.id] === "true" : false };
    });
  }

  return value || defaultValue || "";
};

const customAttributesMap = (raw: Attribute[]): CustomAttributeObject[] => {
  if (!raw || raw.length === 0) return [];

  return raw.map(({ id, value, metadata, label, presentation }) => {
    return {
      id,
      value: getValue({ value, metadata, presentation }),
      label,
      presentation,
      metadata: metadata,
      values: metadata?.values || [],
    };
  });
};

export default customAttributesMap;
