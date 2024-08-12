import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  text?: string;
}

export const ButtonBase: FC<ButtonProps> = ({ text, className, ...props }) => {
  return <button className={className} {...props}>{text}</button>;
};
