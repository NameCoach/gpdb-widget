import { CustomAttributeValue } from "../../../../types/resources/custom-attribute";

export interface InspectorProps {
  value: CustomAttributeValue;
  label: string;
  isChild?: boolean;
}
