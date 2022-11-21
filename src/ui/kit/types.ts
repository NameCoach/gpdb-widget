import { IconProps } from "./Icons/types";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface IconButtonProps extends ButtonProps {
  iconOptions?: IconProps;
  disabled?: boolean;
}
