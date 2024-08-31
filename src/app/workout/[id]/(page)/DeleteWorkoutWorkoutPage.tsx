"use client";
import { CardDeleteButton } from "@/components/delete/deleteArticle";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  title: string;
  id: string;
}

export const DeleteWorkoutWorkoutPage: FC<Props> = ({ title, id }) => {
  const router = useRouter();

  const onDelete = () => {
    router.replace("/workouts");
  };

  return (
    <CardDeleteButton
      title={title}
      id={id}
      size={40}
      onDelete={onDelete}
      workout={true}
    />
  );
};
