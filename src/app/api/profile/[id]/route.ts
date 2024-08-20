import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await User.findById(params.id)
      .select(["-password", "-email"])
      .lean();

    if (user) return NextResponse.json(user, { status: 200 });
    return NextResponse.json({}, { status: 404 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}
