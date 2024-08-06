import { FilledButton } from "@/components/buttons/filled";
import { TextButton } from "@/components/buttons/text";
import { Header } from "@/components/header";
import { DH1 } from "@/components/text/displayFonts/displayFont";
import { TextField } from "@/components/textfields/textfield";
// import { OutlinedButton } from "@/components/buttons/outlined";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/hero-page");
  return <> </>;
}
