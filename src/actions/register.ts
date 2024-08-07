"use server";
import { AuthErrors } from "@/app/auth/types";
import { signInScheme, signUpScheme } from "@/app/auth/validation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";

export const register = async (values: any) => {
  const t = await getTranslations("Authentication");
  const { email, password, username } = values;

  try {
    const result = signUpScheme.safeParse(values);

    if (result.success) {
      await connectDB();
      const userFound = await User.findOne({ email });
      if (userFound) {
        return { isError: true, email: [t("This email already exists")] };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await user.save();
    } else {
      return { ...result.error?.formErrors?.fieldErrors, isError: true };
    }
  } catch (e) {
    console.log(e);
  }
};
