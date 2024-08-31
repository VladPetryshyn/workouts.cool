"use server";
import { createProfileTag } from "@/lib/fetching";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";

export const updatePhoto = async (image: string, id: string) => {
  const t = await getTranslations("UsernameChange");
  try {
    await connectDB();

    await User.findByIdAndUpdate(id, { image });
    revalidateTag(createProfileTag(id));
    return "";
  } catch (e) {
    console.error(e);
    return t("server error");
  }
};
