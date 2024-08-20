"use server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import { getServerSession } from "next-auth";

export const deleteWorkout = async (articleId: string) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    await Workout.findOneAndDelete({
      _id: articleId,
      author: session?.user?.id,
    });
    return true;
  } catch {
    return false;
  }
};
