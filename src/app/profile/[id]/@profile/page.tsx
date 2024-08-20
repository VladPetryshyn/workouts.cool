import { ProfileCard } from "@/components/profile/card";
import Link from "next/link";
import "./styles.scss";
import { createUrlBase } from "@/lib/urlCreators";

interface Props {
  params: { id: string };
  searchParams: {
    content: "workouts" | "articles";
  };
}

export default async function Profile({ params, searchParams }: Props) {
  const active = searchParams.content ?? "articles";
  const resp = await fetch(createUrlBase(`/api/profile/${params.id}`), {
    method: "GET",
    cache: "no-store",
    // next: { tags: [profileTag] },
  });
  const user = await resp.json();

  return (
    <section className="profile-container-profile-card">
      <ProfileCard username={user?.username} id={String(user?._id)} />
      <div className="profile-container-profile-card-switches">
        <Link
          className={`profile-container-profile-card-switches-button ${active === "articles" && "active"}`}
          href={`/profile/${user?._id}?content=articles`}
        >
          <h3>Articles</h3>
        </Link>
        <Link
          className={`profile-container-profile-card-switches-button ${active === "workouts" && "active"}`}
          href={`/profile/${user?._id}?content=workouts`}
        >
          <h3>Workouts</h3>
        </Link>
      </div>
    </section>
  );
}
