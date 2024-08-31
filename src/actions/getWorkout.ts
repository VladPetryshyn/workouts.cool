import Workout, { WorkoutDocument } from "@/models/Workout";

export const getWorkout = async (workoutId: string) => {
  const workout = await Workout.findById(workoutId).populate("author");

  return workout as WorkoutDocument;
};
