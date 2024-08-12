import mongoose, { model, Schema, ObjectId } from "mongoose";
import { UserDocument } from "./User";

export interface ArticleDocument {
  _id: string;
  author: UserDocument;
  title: string;
  content: string;
  hidden: boolean;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [3, "Content must be at least 3 characters long"],
    },
    hidden: Boolean,
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Article =
  mongoose.models?.Article || model<ArticleDocument>("Article", ArticleSchema);
export default Article;
