import { ShimmerAnimation } from "@/components/shimmer";
import "./styles.scss";
import { ContentCardSkeleton } from "@/components/contentCard/skeleton";

export default function Loading() {
  return (
    <section className="profile-content">
      <ContentCardSkeleton />
      <ContentCardSkeleton />
      <ContentCardSkeleton />
      <ContentCardSkeleton />
    </section>
  );
}
