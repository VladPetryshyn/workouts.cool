"use client";
import { updateUsername } from "@/actions/updateUsername";
import { EditModal } from "@/components/modal/edit";
import { TextField } from "@/components/textfields/textfield";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useRef, useState } from "react";

interface Props {
  username: string;
  userId: string;
}

export const EditUsername: FC<Props> = ({ username, userId }) => {
  const session = useSession();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async () => {
    const value = input.current?.value;
    if (value) {
      const isOk = await updateUsername(value, userId);
      if (isOk) {
        router.refresh();
        session.update({username: value});
        closeModal();
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
          />
        </EditModal>
      )}
    </>
  );
};
