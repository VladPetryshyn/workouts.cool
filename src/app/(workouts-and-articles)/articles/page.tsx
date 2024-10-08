import { getArticles } from "@/actions/getArticles";
import { ArticleCard } from "@/components/contentCard";
import { getServerUser } from "@/lib/auth";
import { createArticleEditUrl, createArticleUrl } from "@/lib/urlCreators";
import { Fragment } from "react";

export default async function ArticlesPage() {
  const articles = await getArticles();
  const user = await getServerUser();

  return (
    <Fragment>
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
              isOwner={String(author) === user?.id}
              url={createArticleUrl(_id)}
              editURL={createArticleEditUrl(_id)}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
}
