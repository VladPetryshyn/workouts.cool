"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const getPhoto = async (userId: string) => {
  try {
    await connectDB();

    const user = await User.findById(userId);

    return user.image;
  } catch (err) {
    console.error(err);
  }
};
