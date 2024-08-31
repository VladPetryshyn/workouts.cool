import Image from "next/image";
import { ModalContainer } from "../container";
import "./styles.scss";

export const LoadingModal = () => (
  <ModalContainer className="loading-modal">
    <Image
      src="/spinner.svg"
      alt=""
      height={100}
      width={100}
      className="loading-modal-spinner"
    />
  </ModalContainer>
);
