"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const updateUsername = async (newUsername: string, id: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ username: newUsername });
    if (user) return false;

    await User.findByIdAndUpdate(id, { username: newUsername });
    return true;
  } catch {
    return false;
  }
};
