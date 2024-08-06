import { FC } from "react";
import { ButtonBase, ButtonProps } from "../button";
import "./text.scss";
import classNames from "classnames";

export const TextButton: FC<ButtonProps> = (props) => {
  return <ButtonBase {...props} className={classNames("textButton", props.className)} />;
};
