import { authOptions } from "@/lib/auth";
import { createProfileTag } from "@/lib/fetching";
import { connectDB } from "@/lib/mongodb";
import { makeContentPreview } from "@/lib/rich-text2html";
import Article from "@/models/Articles";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export interface NewArticle {
  title: string;
  content: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      const { title, content } = (await req.json()) as NewArticle;
      connectDB();
      const author = await User.findById(session.user.id);

      if (!author) return NextResponse.json({}, { status: 404 });

      const article = new Article({
        title,
        content,
        contentPreview: makeContentPreview(JSON.parse(content)),
        author: {
          _id: author._id,
          email: author.email,
          password: author.password,
          username: author.username,
          articles: author.articles,
        },
        hidden: true,
      });

      const savedArticle = await article.save();
      author.articles.push(savedArticle);

      revalidateTag(createProfileTag(session?.user?.id));
      return NextResponse.json(savedArticle);
    } catch (e) {
      console.log(e);
      return NextResponse.json({}, { status: 500 });
    }
  }
}
