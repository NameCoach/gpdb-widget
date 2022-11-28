import React from "react";
import { ButtonProps } from "../types";

const Button = ({
  children,
  ...rest
}: ButtonProps, ref): React.ReactElement<ButtonProps> => {
  return <button {...rest} ref={ref}>{children}</button>;
};

export default React.forwardRef(Button);
