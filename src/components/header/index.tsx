"use client";
import Image from "next/image";
import { DH2 } from "../text/displayFonts/displayFont";
import "./header.scss";
import { useToggle } from "@/hooks/useToggle";
import classNames from "classnames";
import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export const Header = () => {
  const [isClicked, toggleIsClicked] = useToggle();
  const session = useSession();

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

  const isAuthenticated = session.status === "authenticated";
  return (
    <header className="header">
      <div className={classNames("header-content", { hidden: !isClicked })}>
        <Link href="/hero-page">
          <DH2 text="work" />
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
          <a href="#">{t("workouts")}</a>
          <a href="#">{t("articles")}</a>
          <a href="#">{t("about us")}</a>
          {!isAuthenticated && <Link href="/auth/sign-in">{t("sign in")}</Link>}
        </nav>
      </div>
    </header>
  );
};
