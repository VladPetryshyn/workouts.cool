import { getArticles } from "@/actions/getArticles";
import { ArticleCard } from "@/components/articleCard";
import "./styles.scss";

export default async function Articles() {
  const articles = await getArticles();

  return (
    <>
      <title>Articles</title>
      <main className="articles-body">
        <h1 className="displayFontH1">Articles</h1>
        <div className="articles-body-content">
          {articles.map(({ _id, title, content }) => (
            <ArticleCard key={_id} _id={_id} title={title} content={content} />
          ))}
        </div>
      </main>
    </>
  );
}
