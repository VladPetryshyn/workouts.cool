import { FC } from "react";
import "./displayFont.scss";

interface Props {
  text: string;
}

export const DH1: FC<Props> = ({ text }) => {
  return <h1 className="displayFontH1">{text}</h1>;
};

export const DH2: FC<Props> = ({ text }) => {
  return <h2 className="displayFontH1">{text}</h2>;
};
