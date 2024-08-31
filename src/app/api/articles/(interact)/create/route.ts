import { authOptions } from "@/lib/auth";
import { createProfileTag } from "@/lib/fetching";
import { connectDB } from "@/lib/mongodb";
import { makeContentPreview } from "@/lib/rich-text2html";
import Article from "@/models/Articles";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { articleValidationScheme } from "../validation";

export interface NewArticle {
  title: string;
  content: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { title, content } = (await req.json()) as NewArticle;
      const validationObj = {
        title,
        contentPreview: makeContentPreview(JSON.parse(content)),
      };
      const result =
        await articleValidationScheme.safeParseAsync(validationObj);

      if (result.success) {
        connectDB();
        const author = await User.findById(session.user.id);

        if (!author) return NextResponse.json({}, { status: 404 });

        const article = new Article({
          ...validationObj,
          content,
          author: author._id,
          hidden: true,
        });

        const savedArticle = await article.save();
        author.articles.push(savedArticle);

        revalidateTag(createProfileTag(session?.user?.id));
        return NextResponse.json(savedArticle);
      } else {
        return NextResponse.json(result?.error?.formErrors?.fieldErrors, {
          status: 403,
        });
      }
    } catch (e) {
      console.log(e);
      return NextResponse.json(e, { status: 500 });
    }
  }
}
