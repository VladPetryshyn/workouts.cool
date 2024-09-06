import { NextRequest, NextResponse } from "next/server";
import Article from "@/models/Articles";
import { getServerUser } from "@/lib/auth";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const user = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 403 });

  try {
    const article = await Article.findOne({
      _id: params.id,
      author: user.id,
    }).select("-author");
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
};
