import classNames from "classnames";
import { ShimmerAnimation } from "../shimmer";
import "./styles.scss";

interface Props {
  className?: string;
}

export const ProfileCardSkeleton = ({ className }: Props) => (
  <div className={classNames("profile-card profile-card-skeleton", className)}>
    <ShimmerAnimation className="shimmer-profile-img profile-card-img" />
    <ShimmerAnimation className="shimmer-profile-username" />
  </div>
);
