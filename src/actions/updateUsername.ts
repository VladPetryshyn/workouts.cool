"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getTranslations } from "next-intl/server";

export const updateUsername = async (newUsername: string, id: string) => {
  const t = await getTranslations("UsernameChange");
  try {
    if (newUsername.length < 4)
      return t("username_must_be_at_least_4_characters_long");
    if (newUsername.length > 20)
      return t("username_cant_be_more_than_20_characters_long");

    await connectDB();
    const user = await User.findOne({ username: newUsername });
    if (user) return t("this_username_is_already_taken");

    await User.findByIdAndUpdate(id, { username: newUsername });
    return "";
  } catch {
    return t("server error");
  }
};
