import { FC } from "react";
import "./outlined.scss";
import { ButtonBase, ButtonProps } from "../button";
import classNames from "classnames";

export const OutlinedButton: FC<ButtonProps> = (props) => {
  return (
    <ButtonBase
      {...props}
      className={classNames("outlinedButton", props.className)}
    />
  );
};
