import Workout, { WorkoutDocument } from "@/models/Workout";
import { redirect } from "next/navigation";

export const getWorkout = async (workoutId: string) => {
  try {
  const workout = await Workout.findById(workoutId).populate("author");

    if (!workout) redirect("/404");

  return workout as WorkoutDocument;
  } catch {
    redirect("/404");
  }
};
