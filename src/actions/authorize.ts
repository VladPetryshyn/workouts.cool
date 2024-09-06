"use server";
import { signInScheme } from "@/app/auth/validation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface Credentials {
  email?: string;
  password?: string;
}

export const authorize = async (credentials: Credentials) => {
  const result = signInScheme.safeParse(credentials);

  if (result.success && credentials.email && credentials.password) {
    await connectDB();
    const user = await User.findOne({
      email: credentials?.email,
    }).select("+password");

    if (!user) return { error: { email: ["Wrong Email!"] }, ok: false };

    const passwordMatch = await bcrypt.compare(
      credentials!.password,
      user.password,
    );

    if (!passwordMatch)
      return { error: { password: ["Wrong Password"] }, ok: false };

    return { error: {}, ok: true };
  } else {
    return { error: result?.error?.formErrors?.fieldErrors ?? {}, ok: false };
  }
};
