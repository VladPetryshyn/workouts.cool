import mongoose, { Schema, model } from "mongoose";
import { ArticleDocument } from "./Articles";
import { WorkoutDocument } from "./Workout";

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  username: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  articles: Array<ArticleDocument>;
  workouts: Array<WorkoutDocument>;
}

export const UserSchema = new Schema<UserDocument>(
  {
    image: {
      type: String,
    },
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
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
