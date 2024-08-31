import { WorkoutItem } from "@/models/Workout";

interface Return {
  timeNeeded: number;
  exerciseAmount: number;
}

export const createExerciseData = (items: Array<WorkoutItem>): Return => ({
  exerciseAmount: items.length,
  timeNeeded: items.reduce(
    (i, { minTime, secTime }) => i + minTime + secTime,
    0,
  ),
});
