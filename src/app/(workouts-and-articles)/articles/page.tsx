import { getArticles } from "@/actions/getArticles";
import { ArticleCard } from "@/components/contentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createArticleEditUrl, createArticleUrl } from "@/lib/urlCreators";

export default async function ArticlesPage() {
  const articles = await getArticles();
  const session = await getServerSession(authOptions);

  return (
    <>
      <title>Articles</title>
      <div className="content-body">
        <h1 className="displayFontH1">Articles</h1>
        <div className="content-body-content">
          {articles.map(({ _id, title, content, author, contentPreview }) => (
            <ArticleCard
              key={_id}
              id={_id}
              title={title}
              content={contentPreview}
              isOwner={String(author) === session?.user?.id}
              url={createArticleUrl(_id)}
              editURL={createArticleEditUrl(_id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
