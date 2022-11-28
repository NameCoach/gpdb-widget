import { CustomAttributeObject } from "../../../../core/mappers/custom-attributes.map";

export interface CustomAttributesInputsProps {
  id: string;
  value: string | boolean | Record<string, any>;
  label: string;
  disabled?: boolean;
  values?: string[];
  metadata?: Record<string, any>;
  hasErrors?: boolean;
  onChange?: (id: string, value: any) => void;
}

export interface CustomAttributesProps {
  disabled?: boolean;
  errors?: any[];
  data: CustomAttributeObject[];
}
