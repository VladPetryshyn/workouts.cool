"use server";
import { getServerUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Articles";

export const deleteArticle = async (articleId: string) => {
  try {
    await connectDB();
    const user = await getServerUser();
    await Article.findOneAndDelete({
      _id: articleId,
      author: user?.id,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
