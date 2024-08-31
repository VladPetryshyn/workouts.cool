import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import { revalidateTag } from "next/cache";
import { createArticleForEditTag, createProfileTag } from "@/lib/fetching";
import { makeContentPreview } from "@/lib/rich-text2html";
import { articleValidationScheme } from "../validation";

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

      const validationObj = {
        title,
        contentPreview: makeContentPreview(JSON.parse(content)),
      };
      const result =
        await articleValidationScheme.safeParseAsync(validationObj);

      if (result.success) {
        connectDB();

        await Article.updateOne(
          { _id: articleId, author: session.user.id },
          {
            title,
            content,
            contentPreview: makeContentPreview(JSON.parse(content)),
          },
        );

        revalidateTag(createProfileTag(session?.user?.id));
        revalidateTag(createArticleForEditTag(articleId));
        return NextResponse.json({ status: "success" });
      } else {
        return NextResponse.json(result?.error?.formErrors?.fieldErrors, {
          status: 403,
        });
      }
    } catch (e) {
      return NextResponse.json(e, { status: 500 });
    }
  }
}
