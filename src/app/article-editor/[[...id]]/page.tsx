import { isMobileDevice } from "@/lib/user-agent";
import "./styles.scss";
import { OutlinedButton } from "@/components/buttons/outlined";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createArticleForEditTag } from "@/lib/fetching";
import ArticleEditor from "./editor/editor";
import { createUrlBase } from "@/lib/urlCreators";

interface Props {
  params: {
    id: string[];
  };
}

export default async function ArticlesEditorPage({ params }: Props) {
  const articleId = params.id?.[0];
  const isMobile = await isMobileDevice();
  let article = null;
  if (articleId && !isMobile) {
    const resp = await fetch(
      createUrlBase(`/api/articles/getForEdit/${articleId}`),
      {
        headers: headers(),
        next: {
          tags: [createArticleForEditTag(articleId)],
        },
      },
    );
    article = await resp.json();
    if (!article && articleId) redirect("/404");
  }

  return (
    <>
      <title>Article Editor</title>
      {isMobile && (
        <main className="articles-editor-phone">
          <h1 className="displayFontH1">unavailable</h1>
          <p>
            Article editing and creation are unavailable on mobile, please use
            your pc for this!
          </p>
          <Link href="/">
            <OutlinedButton text="Return Home" />
          </Link>
        </main>
      )}
      {!isMobile && (
        <ArticleEditor articleId={params?.id?.[0]} article={article} />
      )}
    </>
  );
}
