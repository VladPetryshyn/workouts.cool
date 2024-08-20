import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import { revalidateTag } from "next/cache";
import { createArticleForEditTag, createProfileTag } from "@/lib/fetching";
import { makeContentPreview } from "@/lib/rich-text2html";

export interface ArticleUpdate {
  title: string;
  content: string;
  articleId: string;
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { title, content, articleId } = (await req.json()) as ArticleUpdate;
      connectDB();

      await Article.updateOne(
        { _id: articleId, author: session.user.id },
        { title, content, contentPreview: makeContentPreview(JSON.parse(content)) },
      );

      revalidateTag(createProfileTag(session?.user?.id));
      revalidateTag(createArticleForEditTag(articleId));
      return NextResponse.json({ status: "success" });
    } catch (e) {
      console.log(e);
    }
  }
}
