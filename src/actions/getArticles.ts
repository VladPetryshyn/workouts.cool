import Article from "@/models/Articles";

export const getArticles = async () => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  return articles;
};
