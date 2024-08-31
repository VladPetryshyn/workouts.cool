import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Workout from "@/models/Workout";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 403 });
  try {
    const workout = await Workout.findOne({
      _id: params.id,
      author: session.user.id,
    }).select("-author");

    return NextResponse.json(workout);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
};
