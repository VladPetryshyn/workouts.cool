import { redirect } from "next/navigation";
import "./styles.scss";
import { ArticleCard } from "@/components/contentCard";
import { getWorkouts } from "@/actions/getWorkouts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createArticleEditUrl,
  createArticleUrl,
  createWorkoutEditUrl,
  createWorkoutUrl,
} from "@/lib/urlCreators";
import { getArticles } from "@/actions/getArticles";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    content: "workouts" | "articles";
  };
}

export default async function Profile({ params, searchParams }: Props) {
  const content = searchParams?.content ?? "articles";
  const session = await getServerSession(authOptions);
  if (content !== "workouts" && content !== "articles")
    return redirect(`/profile/${params.id}?content=articles`);

  let workouts = null;
  if (content === "workouts") {
    workouts = await getWorkouts(params.id);
  }

  let articles = null;
  if (content === "articles") {
    articles = await getArticles(params.id);
  }

  return (
    <section className="profile-content">
      {articles?.map(({ _id, title, author, contentPreview }) => (
        <ArticleCard
          key={_id}
          id={_id}
          title={title}
          url={createArticleUrl(_id)}
          editURL={createArticleEditUrl(_id)}
          content={contentPreview}
          isOwner={String(author) === session?.user?.id}
        />
      ))}
      {workouts?.map(({ _id, title, author }) => (
        <ArticleCard
          key={_id}
          id={_id}
          title={title}
          url={createWorkoutUrl(_id)}
          editURL={createWorkoutEditUrl(_id)}
          content={""}
          isOwner={String(author) === session?.user?.id}
          workout={true}
        />
      ))}
    </section>
  );
}
