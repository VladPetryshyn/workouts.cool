"use client";
import { updateUsername } from "@/actions/updateUsername";
import { EditModal } from "@/components/modal/edit";
import { NotificationsContext } from "@/components/notifications";
import { NotificationTypes } from "@/components/notifications/reducer";
import { TextField } from "@/components/textfields/textfield";
import { useSession } from "@/hooks/auth/useSession";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useContext, useRef, useState } from "react";

interface Props {
  username: string;
  userId: string;
}

export const EditUsername: FC<Props> = ({ username, userId }) => {
  const { updateUsername: sessionUsernameUpdate } = useSession();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const context = useContext(NotificationsContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async () => {
    const value = input.current?.value;
    if (value) {
      const msg = await updateUsername(value, userId);
      if (msg === "") {
        sessionUsernameUpdate(value);
        context.pushNotification(
          "Username was successfully changed",
          NotificationTypes.SUCCESS,
        );
        closeModal();
      } else {
        setError(msg);
      }
    }
  };

  return (
    <>
      <button onClick={openModal}>
        <Image
          width={20}
          height={20}
          src={"/pencil.svg"}
          alt="Profile edit username icon"
        />
      </button>
      {isModalOpen && (
        <EditModal
          onCancel={closeModal}
          onConfirm={onSubmit}
          title="update username"
        >
          <TextField
            placeholder="username"
            defaultValue={username}
            ref={input}
            error={error}
          />
        </EditModal>
      )}
    </>
  );
};
