import { getProfile } from "@/actions/getProfiles";
import { ProfileCard } from "@/components/profile/card";
import "./styles.scss";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleCard } from "@/components/articleCard/index";

interface Props {
  params: {
    id: string;
    content: string;
  };
}

export default async function Profile({ params }: Props) {
  if (params.content !== "articles" && params.content !== "workouts")
    redirect(`/profile/${params.id}/articles`);
  const user = await getProfile(params.id);
  return (
    <>
      <title>Profile</title>
      <main className="profile-container">
        <section className="profile-container-profile-card">
          <ProfileCard username={user?.username} id={String(user?._id)} />
          <div className="profile-container-profile-card-switches">
            <Link
              className={`profile-container-profile-card-switches-button ${params.content === "articles" && "active"}`}
              href={`/profile/${params.id}/articles`}
            >
              <h3>Articles</h3>
            </Link>
            <Link
              className={`profile-container-profile-card-switches-button ${params.content === "workouts" && "active"}`}
              href={`/profile/${params.id}/workouts`}
            >
              <h3>Workouts</h3>
            </Link>
          </div>
        </section>
        <section className="profile-content">
          {user?.[params.content]?.map(({ _id, title, content }) => (
            <ArticleCard key={_id} _id={_id} title={title} content={content} />
          ))}
        </section>
      </main>
    </>
  );
}
