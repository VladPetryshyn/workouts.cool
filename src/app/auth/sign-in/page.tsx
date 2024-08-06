"use client";
import { TextField } from "@/components/textfields/textfield";
import "../auth.scss";
import { FilledButton } from "@/components/buttons/filled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const router = useRouter();
  let error = "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      error = res.error as string;
    }
    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="displayFontH2 auth-container-title">welcome back</h1>
      <form className="auth-container-form" onSubmit={handleSubmit}>
        <TextField placeholder="E-mail address" type="email" name="email" />
        <TextField placeholder="Password" type="password" name="password" />
        <FilledButton text="Log In" />
      </form>
      <Link href="/auth/sign-up">Don't have an account? Join now!</Link>
      <h1 color="red">{error}</h1>
    </div>
  );
}
