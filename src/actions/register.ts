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
    const userFound = await User.findOne({ $or: [{ email }, { username }] });
    if (userFound) {
      if (userFound.email === email)
        return { isError: true, email: [t("This email already exists")] };
      if (userFound.username === username)
        return {
          isError: true,
          username: [t("This username is already taken")],
        };
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

    return {
      isError: !isSuccess,
      user: {
        id: savedUser.id,
        username: savedUser.username,
      },
    };
  } else {
    return { ...result.error?.formErrors?.fieldErrors, isError: true };
  }
};
