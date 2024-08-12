import { authOptions } from "@/lib/auth";
import Article from "@/models/Articles";
import { getServerSession } from "next-auth";

export const getArticleToEdit = async (articleId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return;

    const article = await Article.findOne({
      _id: articleId,
      author: session.user.id,
    }).select("-author");
    return article;
  } catch {}
};
