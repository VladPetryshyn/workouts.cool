import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Workout, { WorkoutDocument } from "@/models/Workout";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      await connectDB();

      const author = await User.findById(session.user.id);
      if (!author) return NextResponse.json({}, { status: 404 });

      const data = (await req.json()) as WorkoutDocument;
      console.log(data, "data");
      const newWorkout = new Workout({
        ...data,
        steps: data.steps,
        author: {
          _id: author._id,
          email: author.email,
          password: author.password,
          username: author.username,
          articles: author.articles,
          workouts: author.workouts,
        },
      });

      const savedWorkout = await newWorkout.save();
      author.workouts.push(savedWorkout);

      return NextResponse.json(savedWorkout);
    }
  } catch (e) {
    return NextResponse.json(e, { status: 505 });
  }
};
