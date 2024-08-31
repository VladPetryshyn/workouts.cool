"use server";

import Article from "@/models/Articles";
import { redirect } from "next/navigation";

export const getArticle = async (articleId: string) => {
  try {
    const article = await Article.findById(articleId).populate("author");
    if (!article) redirect("/404");
    return article;
  } catch {
    redirect("/404");
  }
};
