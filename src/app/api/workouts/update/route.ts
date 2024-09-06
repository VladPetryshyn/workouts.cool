import { getServerUser } from "@/lib/auth";
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
  const user = await getServerUser();
  if (user) {
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
          { _id: workoutId, author: user.id },
          {
            title,
            steps,
            ...createExerciseData(steps),
          },
        );

        revalidateTag(createProfileTag(user?.id));
        revalidateTag(createWorkoutForEditTag(workoutId));
        return NextResponse.json({ status: "success" });
      } else {
        return NextResponse.json(result, {
          status: 403,
        });
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json(e, { status: 505 });
    }
  }
}
