import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const getProfile = async (id: string) => {
  try {
    await connectDB();
    const user = await User.findById(id)
      .select(["-password", "-email"])
      .populate({
        path: "articles",
        options: { sort: { createdAt: "desc" } },
      });
    if (user) return user;
  } catch (err) {
    console.log(err);
  }
};
