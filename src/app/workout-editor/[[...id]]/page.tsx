// https://docs.dndkit.com/presets/sortable
// https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/presets-sortable-vertical--removable-items

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

export default async function WorkoutEditorPage({ params }: Props) {
  const workoutId = params.id?.[0];
  const isMobile = await isMobileDevice();

  return (
    <>
      <title>Workout Editor</title>
      {isMobile && (
        <main className="workouts-editor-phone">
          <h1 className="displayFontH1">unavailable</h1>
          <p>
            Workout editing and creation are unavailable on mobile, please use
            your pc for this!
          </p>
          <Link href="/">
            <OutlinedButton text="Return Home" />
          </Link>
        </main>
      )}
      <Editor />
    </>
  );
}
//!isMobile && <Editor articleId={params?.id?.[0]} article={article} />}
