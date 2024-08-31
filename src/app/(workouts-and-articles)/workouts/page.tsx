import { ArticleCard } from "@/components/contentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createWorkoutEditUrl, createWorkoutUrl } from "@/lib/urlCreators";
import { getWorkouts } from "@/actions/getWorkouts";
import { timeFromMilis } from "@/lib/time";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  const session = await getServerSession(authOptions);

  return (
    <>
      <title>Workouts</title>
      <div className="content-body">
        <h1 className="displayFontH1">Workouts</h1>
        <div className="content-body-content">
          {workouts.map(
            ({ _id, title, author, timeNeeded, exerciseAmount }) => (
              <ArticleCard
                key={_id}
                id={_id}
                title={title}
                content={`Time needed: ${timeFromMilis(timeNeeded)}  \nExercise Amount: ${exerciseAmount}`}
                isOwner={String(author) === session?.user?.id}
                url={createWorkoutUrl(_id)}
                editURL={createWorkoutEditUrl(_id)}
                workout={true}
              />
            ),
          )}
        </div>
      </div>
    </>
  );
}
