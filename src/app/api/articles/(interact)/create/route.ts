import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import User from "@/models/User";
import { getServerSession } from "next-auth";
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

      const article = new Article({
        title,
        content,
        author,
        hidden: true,
      });

      const savedArticle = await article.save();
      author.articles.push(savedArticle);
      await author.save();

      return NextResponse.json(savedArticle);
    } catch (e) {
      console.log(e);
    }
  }
}
