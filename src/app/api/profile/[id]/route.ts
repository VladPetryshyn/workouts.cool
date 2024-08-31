import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const user = await User.findById(new mongoose.Types.ObjectId(params.id))
      .select(["-password", "-email"])
      .lean();

    if (user) return NextResponse.json(user, { status: 200 });
    return NextResponse.json({}, { status: 404 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
