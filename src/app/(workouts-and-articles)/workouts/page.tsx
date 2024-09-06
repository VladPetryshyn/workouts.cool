import { ArticleCard } from "@/components/contentCard";
import { getServerUser } from "@/lib/auth";
import { createWorkoutEditUrl, createWorkoutUrl } from "@/lib/urlCreators";
import { getWorkouts } from "@/actions/getWorkouts";
import { timeFromMilis } from "@/lib/time";
import { Fragment } from "react";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  const user = await getServerUser();

  return (
    <Fragment>
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
                isOwner={String(author) === user?.id}
                url={createWorkoutUrl(_id)}
                editURL={createWorkoutEditUrl(_id)}
                workout={true}
              />
            ),
          )}
        </div>
      </div>
    </Fragment>
  );
}
