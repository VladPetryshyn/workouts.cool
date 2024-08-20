import { FC } from "react";
import "./styles.scss";

interface Props {
  text: string;
	onClick?: () => void
  className?: string;
}

export const ModalButton: FC<Props> = ({ text, onClick, className }) => {
  return (
    <button className={`modal-button ${className ?? ""}`} onClick={onClick}>
      <p>{text}</p>
    </button>
  );
};
