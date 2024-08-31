import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { revalidateTag } from "next/cache";
import { createProfileTag, createWorkoutForEditTag } from "@/lib/fetching";
import Workout, { WorkoutItem } from "@/models/Workout";
import { createExerciseData } from "../meta";
import { validateWorkout } from "../validation";

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
      const validationObj = {
        title,
        steps,
      };
      const result = await validateWorkout(validationObj);

      if (result.success) {
        connectDB();

        await Workout.updateOne(
          { _id: workoutId, author: session.user.id },
          {
            title,
            steps,
            ...createExerciseData(steps),
          },
        );

        revalidateTag(createProfileTag(session?.user?.id));
        revalidateTag(createWorkoutForEditTag(workoutId));
        return NextResponse.json({ status: "success" });
      } else {
        return NextResponse.json(result, {
          status: 403,
        });
      }
    } catch (e) {
      console.log(e);
      return NextResponse.json(e, { status: 505 });
    }
  }
}
