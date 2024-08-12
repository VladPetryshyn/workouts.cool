import { getArticle } from "@/actions/getArticle";
import { redirect } from "next/navigation";
import "./styles.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { isMobileDevice } from "@/lib/user-agent";
import { richTextToHtml } from "@/lib/rich-text2html";

interface Props {
  params: {
    articleId: string;
  };
}

export default async function ArticleId({ params: { articleId } }: Props) {
  const session = await getServerSession(authOptions);
  const article = await getArticle(articleId);
  const isOwner = article.author.toString() === session?.user?.id;
  const isMobile = await isMobileDevice();
  if (!article) redirect("/404");
  if (article.hidden && !isOwner) redirect("/404");

  return (
    <>
      <title>{article.title}</title>
      <main className="article-view-body">
        <div className="article-view-body-header">
          <h1 className="displayFontH1">
            {article.title}
            {isOwner && !isMobile && (
              <Link href={`/article-editor/${article.id}`}>
                <Image width={40} height={40} src="/pencil.svg" />
              </Link>
            )}
          </h1>
        </div>
        <div className="article-view-body-content">
          {richTextToHtml(article.content)}
        </div>
      </main>
    </>
  );
}
