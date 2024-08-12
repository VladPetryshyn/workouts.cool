"use client";
import { signOut, useSession } from "next-auth/react";
import "./styles.scss";
import { FC } from "react";
import Image from "next/image";
import { OutlinedButton } from "../buttons/outlined";

interface Props {
  username: string;
  id: string;
  image?: string;
  className?: string;
}

export const ProfileCard: FC<Props> = ({ username, id, image, className }) => {
  const session = useSession();

  const isOwner = session.data?.user.id === id;
  return (
    <div className={`profile-card ${className}`}>
      <div className="profile-card-img">
        <Image
          width={90}
          height={90}
          src={image ?? "/user.svg"}
          alt="User Profile Image"
        />
        {isOwner && (
          <button className="profile-card-img-upload">
            <Image src="/image-upload.svg" width={25} height={25} />
          </button>
        )}
      </div>
      <h2>
        {username}
        {isOwner && (
          <Image
            width={20}
            height={20}
            src={"/pencil.svg"}
            alt="Profile edit username icon"
          />
        )}
      </h2>
      {isOwner && <OutlinedButton text="Logout" onClick={signOut} className="profile-card-logout" />}
    </div>
  );
};
