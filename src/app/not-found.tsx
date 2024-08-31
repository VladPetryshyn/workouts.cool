import { OutlinedButton } from "@/components/buttons/outlined";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container-with-padding not-found-page">
      <h1 className="displayFontH1">404</h1>
      <h2>
        Oops! It seems yo&#39;uve wandered off the beaten path.
      </h2>
      <Link href="/">
        <OutlinedButton text="Take me home" />
      </Link>
    </main>
  );
}
