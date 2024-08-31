"use client";
import { TextField } from "@/components/textfields/textfield";
import "../auth.scss";
import { FilledButton } from "@/components/buttons/filled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { AuthErrors } from "../types";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const router = useRouter();
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Authentication");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setErrors(JSON.parse(res.error));
    }
    if (res?.ok) {
      return router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <>
      <title>{t("welcome back")}</title>
      <div className="auth-container">
        <h1 className="displayFontH2 auth-container-title">
          {t("welcome back")}
        </h1>
        <form className="auth-container-form" onSubmit={handleSubmit}>
          <TextField
            placeholder={t("E-mail address")}
            type="email"
            name="email"
            error={errors.email?.[0]}
            disabled={isLoading}
          />
          <TextField
            placeholder={t("Password")}
            type="password"
            name="password"
            error={errors.password?.[0]}
            disabled={isLoading}
          />
          <FilledButton text={t("Log In")} disabled={isLoading} />
        </form>
        <Link href="/auth/sign-up">
          {t("Don't have an account? Join now!")}
        </Link>
      </div>
    </>
  );
}
