"use client";
import { FilledButton } from "@/components/buttons/filled";
import { TextField } from "@/components/textfields/textfield";
import Link from "next/link";
import { register } from "@/actions/register";
import "../auth.scss";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const r = await register({
      email: formData.get("email"),
      password: formData.get("password"),
      username: formData.get("username"),
    });
    //ref.current?.reset();
    if (r?.error) {
      //setError(r.error);
      return;
    } else {
      return router.push("/auth/sign-in");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="displayFontH2 auth-container-title">Join our community</h1>
      <form className="auth-container-form" action={handleSubmit}>
        <TextField placeholder="Username" name="username" type="text" />
        <TextField placeholder="E-mail address" name="email" type="email" />
        <TextField placeholder="Password" name="password" type="password" />
        <FilledButton text="Register" />
      </form>
      <Link href="/auth/sign-in">Already have an account? Log in!</Link>
    </div>
  );
}
