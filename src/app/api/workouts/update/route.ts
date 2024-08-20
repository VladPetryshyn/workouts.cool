import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { revalidateTag } from "next/cache";
import { createProfileTag, createWorkoutForEditTag } from "@/lib/fetching";
import Workout, { WorkoutItem } from "@/models/Workout";

export interface WorkoutUpdate {
  title: string;
  steps: Array<WorkoutItem>;
  workoutId: string;
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { title, steps, workoutId } = (await req.json()) as WorkoutUpdate;
      connectDB();

      await Workout.updateOne(
        { _id: workoutId, author: session.user.id },
        {
          title,
          steps,
        },
      );

      revalidateTag(createProfileTag(session?.user?.id));
      revalidateTag(createWorkoutForEditTag(workoutId));
      return NextResponse.json({ status: "success" });
    } catch (e) {
      console.log(e);
    }
  }
}
