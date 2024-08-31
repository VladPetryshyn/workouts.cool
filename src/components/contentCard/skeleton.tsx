import { ShimmerAnimation } from "../shimmer";
import "./styles.scss";

export const ContentCardSkeleton = () => (
  <div className="article-card">
    <div className="article-card-text">
      <ShimmerAnimation className="article-card-text-title card-shimmer-title" />
      <ShimmerAnimation className="article-card-text-description card-shimmer-description" />
    </div>
    <div className="article-card-interact">
      <ShimmerAnimation className="article-card-interact-view card-shimmer-link" />
    </div>
  </div>
);
