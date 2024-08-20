import { FC } from "react";
import "./styles.scss";

interface Props {
  className?: string;
}

export const ShimmerAnimation: FC<Props> = ({ className }) => {
  return <div className={`shimmer-element ${className}`}></div>;
};
