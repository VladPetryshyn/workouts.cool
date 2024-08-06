import { FC } from "react";
import { ButtonBase, ButtonProps } from "../button";
import "./filled.scss";
import classNames from "classnames";

export const FilledButton: FC<ButtonProps> = (props) => {
  return (
    <ButtonBase
      {...props}
      className={classNames("filledButton", props.className)}
    />
  );
};
