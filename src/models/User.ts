import mongoose, { Schema, model } from "mongoose";
import { ArticleDocument } from "./Articles";

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  username: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  articles: Array<ArticleDocument>;
}

export const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      //unique: true,
      sparse: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Name is required"],
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
