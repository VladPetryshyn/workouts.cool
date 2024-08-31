import { ContentCardSkeleton } from "@/components/contentCard/skeleton";
import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("workouts-and-articles-loading");

  return (
    <div className="content-body">
      <h1 className="displayFontH1">{t("loading")}</h1>
      <div className="content-body-content">
        <ContentCardSkeleton />
        <ContentCardSkeleton />
        <ContentCardSkeleton />
        <ContentCardSkeleton />
      </div>
    </div>
  );
}
