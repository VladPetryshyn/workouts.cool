import mongoose, { model, Schema } from "mongoose";
import { UserDocument } from "./User";

export interface WorkoutDocument {
  _id: string;
  author: UserDocument;
  title: string;
  steps: [
    {
      time: number;
      title: string;
      description: string;
      id: string;
    },
  ];
}

const WorkoutSchema = new Schema<WorkoutDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Workout =
  mongoose.models?.Workout || model<WorkoutDocument>("Workout", WorkoutSchema);
export default Workout;
