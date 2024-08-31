import "./styles.css";
import { ReactNode } from "react";

interface Props {
  text: string;
  className?: string;
  children: ReactNode;
}

export const Tooltip = ({ text, className, children }: Props) => {
  return (
    <div className={`tooltip-container ${className ?? ""}`}>
      <div className="tooltip-content">{text}</div>
      <div className="tooltip-body">{children}</div>
    </div>
  );
};
