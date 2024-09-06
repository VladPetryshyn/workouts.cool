import { getServerUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Workout, { WorkoutDocument } from "@/models/Workout";
import { NextRequest, NextResponse } from "next/server";
import { createExerciseData } from "../meta";
import { validateWorkout } from "../validation";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerUser();
    if (user) {
      const data = (await req.json()) as WorkoutDocument;
      const validationObj = {
        title: data.title,
        steps: data.steps,
      };
      const result = await validateWorkout(validationObj);

      if (result.success) {
        await connectDB();

        const author = await User.findById(user.id);
        if (!author) return NextResponse.json({}, { status: 404 });

        const newWorkout = new Workout({
          ...data,
          steps: data.steps,
          ...createExerciseData(data.steps),
          author: author._id,
        });

        const savedWorkout = await newWorkout.save();
        author.workouts.push(savedWorkout);

        return NextResponse.json(savedWorkout);
      } else {
        return NextResponse.json(result, {
          status: 403,
        });
      }
    }
  } catch (e) {
    return NextResponse.json(e, { status: 505 });
  }
};
