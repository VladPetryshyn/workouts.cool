"use client";
import { FC, useState } from "react";
import { DataModal } from "../modal/data";
import Image from "next/image";
import { deleteArticle } from "@/actions/deleteArticle";
import { deleteWorkout } from "@/actions/deleteWorkout";

export interface CardDeleteButtonProps {
  title: string;
  id: string;
  size: number;
  onDelete?: () => void;
  workout?: boolean;
}

export const CardDeleteButton: FC<CardDeleteButtonProps> = ({
  title,
  size = 25,
  id,
  workout,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onConfirm = async () => {
    const isOk = await (workout ? deleteWorkout : deleteArticle)(id);
    if (isOk) {
      if (props.onDelete) props.onDelete();
      close();
    }
  };

  return (
    <>
      <button onClick={open}>
        <Image height={size} width={size} src="/trash.svg" alt="Delete Icon" />
      </button>
      {isOpen && (
        <DataModal
          iconPath="/trash.svg"
          title={`Delete ${workout ? "Workout" : "Article"}`}
          subtitle={`Are you sure that you want to delete ${workout ? "workout" :"article" }: '${title}'`}
          onCancel={close}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};
