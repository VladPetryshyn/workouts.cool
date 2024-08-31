import { DataModal } from "@/components/modal/data";
import { FC } from "react";

interface Props {
  closeModal: () => void;
  onModalAgree: () => void;
}

export const PermModal: FC<Props> = ({ closeModal, onModalAgree }) => {
  return (
    <DataModal
      title="Please enable automatic audio playback!"
      subtitle="Please enable automatic audio playback to be able to hear when the exercise starts!"
      onCancel={closeModal}
      onConfirm={onModalAgree}
      iconPath="/speaker.svg"
    />
  );
};
