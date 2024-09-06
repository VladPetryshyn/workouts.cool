import { NextRequest, NextResponse } from "next/server";
import Workout from "@/models/Workout";
import { getServerUser } from "@/lib/auth";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const user = await getServerUser();

  if (!user) return NextResponse.json({}, { status: 403 });
  try {
    const workout = await Workout.findOne({
      _id: params.id,
      author: user.id,
    }).select("-author");

    return NextResponse.json(workout);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
};
