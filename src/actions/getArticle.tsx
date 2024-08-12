"use server";

import Article from "@/models/Articles";

export const getArticle = async (articleId: string) => {
  const article = await Article.findById(articleId);
  return article;
};
