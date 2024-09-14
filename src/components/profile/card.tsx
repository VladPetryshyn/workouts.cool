"use client";
import "./styles.scss";
import { FC } from "react";
import Image from "next/image";
import { OutlinedButton } from "../buttons/outlined";
import { EditUsername } from "./edit/username";
import { EditPhoto } from "./edit/photo";
import { useSession } from "@/hooks/auth/useSession";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";

interface Props {
  username: string;
  id: string;
  image?: string;
  className?: string;
}

export const ProfileCard: FC<Props> = ({ username, id, image, className }) => {
  const { state: user, logout: logoutClient } = useSession();
  const router = useRouter();

  const onLogout = async () => {
    const didLogout = await logout();
    if (didLogout) {
      logoutClient();
      router.replace("/");
    }
  };

  const isOwner = user?.id === id;
  return (
    <div className={`profile-card ${className}`}>
      <div className="profile-card-img">
        <Image
          width={90}
          height={90}
          src={image || "/user.svg"}
          alt="User Profile Image"
        />
        {isOwner && <EditPhoto userId={id} />}
      </div>
      <h2>
        {`${username} `}
        {isOwner && <EditUsername username={username} userId={id} />}
      </h2>
      {isOwner && (
        <OutlinedButton
          text="Logout"
          onClick={onLogout}
          className="profile-card-logout"
        />
      )}
    </div>
  );
};
