import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Article from "@/models/Articles";
import { getServerSession } from "next-auth";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 403 });
  try {
    const article = await Article.findOne({
      _id: params.id,
      author: session.user.id,
    }).select("-author");
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
};
