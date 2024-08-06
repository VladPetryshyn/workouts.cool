"use client";
import Image from "next/image";
import { DH2 } from "../text/displayFonts/displayFont";
import "./header.scss";
import { useToggle } from "@/hooks/useToggle";
import classNames from "classnames";
import { useEffect } from "react";
import Link from "next/link";

export const Header = () => {
  const [isClicked, toggleIsClicked] = useToggle();

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

  return (
    <header className="header">
      <div className={classNames("header-content", { hidden: !isClicked })}>
        <Link href="/"><DH2 text="work" /></Link>
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
          <a href="#">workouts</a>
          <a href="#">articles</a>
          <a href="#">about us</a>
          <Link href="/auth/sign-in">sign in</Link>
        </nav>
      </div>
    </header>
  );
};
