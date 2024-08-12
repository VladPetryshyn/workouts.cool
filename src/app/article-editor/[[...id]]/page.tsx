import { isMobileDevice } from "@/lib/user-agent";
import "./styles.scss";
import { OutlinedButton } from "@/components/buttons/outlined";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getArticleToEdit } from "@/actions/getArticleToEdit";
import { redirect } from "next/navigation";

const Editor = dynamic(() => import("./editor/editor.tsx"), {
  ssr: false,
  loading: () => <p> Loading... </p>,
});

interface Props {
  params: {
    id: string[];
  };
}

export default async function ArticlesEditorPage({ params }: Props) {
  const articleId = params.id?.[0];
  const isMobile = await isMobileDevice();
  let article = null;
  if (articleId) {
    article = await getArticleToEdit(articleId);
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
      {!isMobile && <Editor articleId={params?.id?.[0]} article={article} />}
    </>
  );
}
