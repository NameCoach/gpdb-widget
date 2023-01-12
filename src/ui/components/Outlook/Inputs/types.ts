import { CustomAttributeObject } from "../../../../types/resources/custom-attribute";

export interface CustomAttributesInputsProps
  extends Omit<CustomAttributeObject, "presentation"> {
  hasErrors?: boolean;
  disabled?: boolean;
  onChange?: (id: string, value: any) => void;
  isChild?: boolean;
}

export interface CustomAttributesProps {
  disabled?: boolean;
  errors?: any[];
  data: CustomAttributeObject[];
  makeChanges: (value: boolean) => void;
}
