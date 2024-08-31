import { authOptions } from "@/lib/auth";
import "./hero-page.scss";
import { OutlinedButton } from "@/components/buttons/outlined";
import { getServerSession } from "next-auth";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <>
      <title>{t("title")}</title>
      <div className="hero-page-content">
        <main className="hero-section">
          <div className="hero-section-text">
            <h1 className="displayFontH2">{t("time_to_change")}</h1>
            <p>
              {t("Start changing you're body with our articles, and workouts")}
            </p>
          </div>
          <OutlinedButton
            text={t("Start the change")}
            className="call-to-action-btn"
          />
        </main>
        <section className="join-community">
          <Image
            src="/hero-page/join-now.svg"
            alt="globe icon"
            width={200}
            height={200}
            className="globe"
          />
          <h1 className="displayFontH2">
            {t("Join the world wide community!")}
          </h1>
          <OutlinedButton text={t("join now!")} />
        </section>
      </div>
    </>
  );
}
