import { CustomAttributeObject } from "../../../../core/mappers/custom-attributes.map";

export interface CustomAttributesInputsProps {
  id: string;
  value: string | boolean | Record<string, any>;
  label: string;
  disabled?: boolean;
  values?: string[];
  metadata?: Record<string, any>;
  onUpdate: (any) => void;
  hasErrors?: boolean;
}

export interface CustomAttributesProps {
  disabled?: boolean;
  errors?: any[];
  data: CustomAttributeObject[],
  setData: (data: CustomAttributeObject[]) => void,
}
