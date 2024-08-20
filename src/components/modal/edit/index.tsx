import { FC, ReactNode } from "react";
import { ModalContainer } from "../container";
import { ModalButton } from "../button";
import { ModalHeader } from "../header";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
	children: ReactNode;
}

export const EditModal: FC<Props> = ({ title, onCancel, onConfirm, children }) => {
  return (
    <ModalContainer
      onDismiss={onCancel}
      buttons={
        <>
          <ModalButton text="Cancel" onClick={onCancel} />
          <ModalButton text="OK" onClick={onConfirm} />
        </>
      }
    >
      <ModalHeader title={title} />
			{children}
    </ModalContainer>
  );
};
