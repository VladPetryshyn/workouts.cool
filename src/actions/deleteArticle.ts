"use server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";
import { getServerSession } from "next-auth";

export const deleteArticle = async (articleId: string) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    await Article.findOneAndDelete({
      _id: articleId,
      author: session?.user?.id,
    });
    return true;
  } catch {
    return false;
  }
};
