import mongoose, { model, Schema } from "mongoose";
import { UserDocument } from "./User";

export interface WorkoutItem {
  id: string;
  title: string;
  description: string;
  minTime: number;
  secTime: number;
  totalTime: number;
}

export interface WorkoutDocument {
  _id: string;
  author: UserDocument;
  title: string;
  steps: Array<WorkoutItem>;
  timeNeeded: number;
  exerciseAmount: number;
}

const StepSchema = new Schema<WorkoutItem>(
  {
    id: String,
    title: String,
    description: String,
    minTime: Number,
    secTime: Number,
    totalTime: Number,
  },
  { _id: false },
);

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
    steps: [StepSchema],
    exerciseAmount: {
      type: Number,
      required: true,
    },
    timeNeeded: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Workout =
  mongoose.models?.Workout || model<WorkoutDocument>("Workout", WorkoutSchema);
export default Workout;
