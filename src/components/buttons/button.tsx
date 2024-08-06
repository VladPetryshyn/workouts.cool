import { FC } from "react";

export interface ButtonProps {
  className?: string;
  text?: string;
}

export const ButtonBase: FC<ButtonProps> = ({ text, className }) => {
  return <button className={className}>{text}</button>;
};
