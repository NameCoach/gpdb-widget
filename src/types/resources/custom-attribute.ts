import { AttributeConfig } from "gpdb-api-client";

export enum AttributePresentation {
  Textbox = "Textbox",
  Dropdown = "Dropdown",
  Checkbox = "Checkbox",
  Textarea = "Textarea",
  MultipleCheckbox = "MultipleCheckbox",
  Radio = "Radio",
}

export type MultipleCheckboxField = {
  id: string;
  label: string;
  value: boolean;
};

export type CustomAttributeValue = string | boolean | MultipleCheckboxField[];

export default interface CustomAttribute {
  presentation: AttributePresentation;
  id: string;
  label: string;
  value: CustomAttributeValue;
  disabled?: boolean;
}

export type Attribute = CustomAttribute & AttributeConfig;

export type CustomAttributesValues = string[] | MultipleCheckboxField[];

export type CustomAttributeObject = Attribute & {
  values?: CustomAttributesValues;
};
