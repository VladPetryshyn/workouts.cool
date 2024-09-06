"use server";
import { signUpScheme } from "@/app/auth/validation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { createToken } from "@/lib/auth";

export const register = async (values: any) => {
  const t = await getTranslations("Authentication");
  const { email, password, username } = values;

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
      image: "",
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const isSuccess = await createToken({
      username: savedUser.username,
      id: savedUser._id,
    });

    return { isError: !isSuccess };
  } else {
    return { ...result.error?.formErrors?.fieldErrors, isError: true };
  }
};
