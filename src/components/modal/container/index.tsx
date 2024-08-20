"use client";
import { FC, ReactNode } from "react";
import "./styles.scss";

interface Props {
  children: ReactNode;
  className?: string;
  buttons?: ReactNode;
  onDismiss?: () => void;
}

export const ModalContainer: FC<Props> = ({ children, className, buttons, onDismiss }) => {
  return (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={onDismiss}></div>
      <div className="modal-content">
        <div className={`modal-content-content ${className ?? ""}`}>
          {children}
        </div>
        <div className="modal-content-footer">{buttons}</div>
      </div>
    </div>
  );
};
