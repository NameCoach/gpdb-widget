export enum AttributePresentation {
  TextBox = "Textbox",
  Dropdown = "Dropdown",
  Checkbox = "Checkbox",
  Textarea = "Textarea",
}

export default interface CustomAttribute {
  presentation: AttributePresentation;
  id: string;
  label: string;
  value: null | string | boolean;
  disabled?: boolean;
}
