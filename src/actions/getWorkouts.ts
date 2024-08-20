'use server'
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Workout, { WorkoutDocument } from "@/models/Workout";

export const getWorkouts = async (author?: string) => {
  await connectDB();
  if (author) {
    const auth = await User.findById(author);
    const workouts = await Workout.find({ author: auth }).sort({
      createdAt: "desc",
    });

    return workouts;
  }
  const workouts = await Workout.find().sort({
    createdAt: "desc",
  });

  return workouts as Array<WorkoutDocument>;
};
