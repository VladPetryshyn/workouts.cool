"use client";
import Image from "next/image";
import "./header.scss";
import { useToggle } from "@/hooks/useToggle";
import classNames from "classnames";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProfileInfo } from "../profileItem";
import { usePathname } from "next/navigation";
import { getPhoto } from "@/actions/getPhoto";
import { useSession } from "@/hooks/auth/useSession";

export const Header = () => {
  const [isClicked, toggleIsClicked, setIsClicked] = useToggle();
  const { state: user } = useSession();
  const path = usePathname();
  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    setIsClicked(false);
  }, [path]);

  useEffect(() => {
    if (user?.id) {
      getPhoto(user.id).then((img) => {
        setProfilePic(img);
      });
    }
  }, [user]);

  useEffect(() => {
    if (isClicked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isClicked]);
  const t = useTranslations("Header");

  const isAuthenticated = user.valid;
  const profileUrl = `/profile/${user?.id}`;

  return (
    <header className="header">
      <div className={classNames("header-content", { hidden: !isClicked })}>
        <Link href="/hero-page">
          <h1 className="displayFontH1">work</h1>
        </Link>
        <Image
          src={isClicked ? "/close.svg" : "/menu.svg"}
          width={50}
          height={50}
          onClick={toggleIsClicked}
          className="icon"
          alt="icon"
        />
      </div>
      <div
        className={classNames("header-nav-container", { hidden: !isClicked })}
      >
        <nav className="header-nav">
          {isAuthenticated && (
            <ProfileInfo
              profileId={user?.id!}
              username={user?.username!}
              image={profilePic}
            />
          )}
          <a href="/workouts">{t("workouts")}</a>
          <Link href="/articles">{t("articles")}</Link>
          {isAuthenticated && (
            <Link href={profileUrl} className="header-nav-profile-desktop">
              <Image
                width={50}
                height={50}
                src={profilePic || "/user.svg"}
                alt={"Profile Picture"}
              />
            </Link>
          )}
          {!isAuthenticated && <Link href="/auth/sign-in">{t("sign in")}</Link>}
        </nav>
      </div>
    </header>
  );
};
