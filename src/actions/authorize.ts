"use server";
import { signInScheme } from "@/app/auth/validation";
import { createToken } from "@/lib/auth";
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
    try {
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

      await createToken({ username: user.username, id: user._id });
      return { error: {}, ok: true };
    } catch (err) {
      console.error(err);
      return { error: err, ok: false };
    }
  } else {
    return { error: result?.error?.formErrors?.fieldErrors ?? {}, ok: false };
  }
};
