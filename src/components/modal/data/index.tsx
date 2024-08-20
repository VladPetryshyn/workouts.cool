import Image from "next/image";
import { ModalContainer } from "../container";
import "./styles.scss";
import { ModalButton } from "../button";
import { FC } from "react";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  iconPath: string;
  title: string;
  subtitle: string;
}

export const DataModal: FC<Props> = ({
  onCancel,
  onConfirm,
  iconPath,
  title,
  subtitle,
}) => {
  return (
    <ModalContainer
      className="data-modal"
			onDismiss={onCancel}
      buttons={
        <>
          <ModalButton text="Cancel" onClick={onCancel} />
          <ModalButton text="OK" onClick={onConfirm} />
        </>
      }
    >
      <Image width={80} height={80} src={iconPath ?? "/trash.svg"} />
      <h2 className="displayFontH2">{title}</h2>
      <p>{subtitle}</p>
    </ModalContainer>
  );
};
