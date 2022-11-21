import React from "react";
import { components } from "react-select";

export interface CustomProps {
  "data-tip"?: string;
  "data-for"?: string;
}

const Control = (customProps: CustomProps) => ({ children, ...props }) => {
  return (
    <div {...customProps}>
      <components.Control {...props}>{children}</components.Control>
    </div>
  );
};

export default Control;
