"use server";
import { connectDB } from "@/lib/mongodb";
import Article, { ArticleDocument } from "@/models/Articles";
import User from "@/models/User";

export const getArticles = async (author?: string) => {
  try {
    await connectDB();
    if (author) {
      const auth = await User.findById(author);
      const articles = await Article.find({ author: auth }).sort({
        createdAt: "desc",
      });

      return articles;
    }
    const articles = await Article.find().sort({
      createdAt: "desc",
    });
    return articles as Array<ArticleDocument>;
  } catch {
    return [];
  }
};
