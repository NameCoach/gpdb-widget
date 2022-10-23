import React from "react";
import { ButtonProps } from "../types";

const Button = ({
  children,
  ...rest
}: ButtonProps): React.ReactElement<ButtonProps> => {
  return <button {...rest}>{children}</button>;
};

export default Button;
