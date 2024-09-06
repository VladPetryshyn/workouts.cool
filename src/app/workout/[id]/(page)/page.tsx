import "./styles.scss";
import { ProfileInfo } from "@/components/profileItem";
import Image from "next/image";
import Link from "next/link";
import { WorkoutPreviewCard } from "@/components/workoutPreviewCard";
import { OutlinedButton } from "@/components/buttons/outlined";
import { getWorkout } from "@/actions/getWorkout";
import { timeFromMilis } from "@/lib/time";
import { getServerUser } from "@/lib/auth";
import { DeleteWorkoutWorkoutPage } from "./DeleteWorkoutWorkoutPage";

export default async function WorkoutPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const workoutData = await getWorkout(id);
  const data = await getServerUser();
  const isOwner = workoutData.author._id.toString() === data?.id;

  return (
    <>
      <title>Workout</title>
      <main className="workout-preview">
        <div className="workout-preview-header">
          <h1 className="displayFontH1">
            {workoutData.title}
            {isOwner && (
              <Link href={`/workout-editor/${id}`}>
                <Image
                  width={40}
                  height={40}
                  src="/pencil.svg"
                  alt="edit-workout"
                />
              </Link>
            )}
            {isOwner && (
              <DeleteWorkoutWorkoutPage title={workoutData.title} id={id} />
            )}
          </h1>
          <ProfileInfo
            username={workoutData.author.username}
            profileId={workoutData.author._id}
            image={workoutData?.author?.image}
          />
        </div>
        <div className="workout-preview-content">
          <WorkoutPreviewCard
            icon="clock"
            title="Exercise time"
            content={timeFromMilis(workoutData.timeNeeded)}
          />
          <WorkoutPreviewCard
            icon="dumbell"
            title="Number of Exercises"
            content={workoutData.exerciseAmount.toString()}
          />
        </div>
        <Link className="workout-preview-start" href={`/workout/${id}/workout`}>
          <OutlinedButton text="Start workout" />
        </Link>
      </main>
    </>
  );
}
