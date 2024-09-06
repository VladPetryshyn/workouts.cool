import { createProfileTag } from "@/lib/fetching";
import { connectDB } from "@/lib/mongodb";
import { makeContentPreview } from "@/lib/rich-text2html";
import Article from "@/models/Articles";
import User from "@/models/User";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { articleValidationScheme } from "../validation";
import { getServerUser } from "@/lib/auth";

export interface NewArticle {
  title: string;
  content: string;
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (user) {
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
        const author = await User.findById(user.id);

        if (!author) return NextResponse.json({}, { status: 404 });

        const article = new Article({
          ...validationObj,
          content,
          author: author._id,
          hidden: true,
        });

        const savedArticle = await article.save();
        author.articles.push(savedArticle);

        revalidateTag(createProfileTag(user?.id));
        return NextResponse.json(savedArticle);
      } else {
        return NextResponse.json(result?.error?.formErrors?.fieldErrors, {
          status: 403,
        });
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json(e, { status: 500 });
    }
  }
}
