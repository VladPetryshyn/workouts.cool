"use client";
import { FilledButton } from "@/components/buttons/filled";
import { TextField } from "@/components/textfields/textfield";
import Link from "next/link";
import { register } from "@/actions/register";
import "../auth.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthErrors } from "../types";
import { useTranslations } from "next-intl";
import { LoadingModal } from "@/components/modal/loading";

export default function SignUp() {
  const router = useRouter();
  const [errors, setErrors] = useState<AuthErrors>();
  const t = useTranslations("Authentication");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const r = await register({
      email: formData.get("email"),
      password: formData.get("password"),
      username: formData.get("username"),
    });
    setIsLoading(false);
    if (r?.isError) {
      const { isError, ...errors } = r;
      setErrors(errors as AuthErrors);
      return;
    } else {
      return router.push("/auth/sign-in");
    }
  };

  return (
    <>
      <title>{t("Join our community")}</title>
      <div className="auth-container">
        <h1 className="displayFontH2 auth-container-title">
          {t("Join our community")}
        </h1>
        <form className="auth-container-form" action={handleSubmit}>
          <TextField
            placeholder={t("Username")}
            name="username"
            type="text"
            error={errors?.username?.[0]}
            disabled={isLoading}
          />
          <TextField
            placeholder={t("E-mail address")}
            name="email"
            type="email"
            error={errors?.email?.[0]}
            disabled={isLoading}
          />
          <TextField
            placeholder={t("Password")}
            name="password"
            type="password"
            error={errors?.password?.[0]}
            disabled={isLoading}
          />
          <FilledButton text={t("Register")} />
        </form>
        <Link href="/auth/sign-in">
          {t("Already have an account? Log in!")}
        </Link>
      </div>
      {isLoading && <LoadingModal />}
    </>
  );
}
