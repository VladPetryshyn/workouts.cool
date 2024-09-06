"use server";
import { getServerUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";

export const deleteWorkout = async (articleId: string) => {
  try {
    await connectDB();
    const user = await getServerUser();
    await Workout.findOneAndDelete({
      _id: articleId,
      author: user?.id,
    });
    return true;
  } catch (e){
    console.error(e);
    return false;
  }
};
