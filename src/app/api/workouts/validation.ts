import { WorkoutItem } from "@/models/Workout";
import { getTranslations } from "next-intl/server";
import z from "zod";

const workoutStep = z.object({
  title: z.string().max(30).min(4),
  description: z.string().max(200).min(20),
  totalTime: z.number().min(30_000),

  // only for backend
  secTime: z.number().min(30_000).max(60_000),
  minTime: z.number().max(3_600_000),
});

export interface ValidationErrors {
  title: any;
  steps: any[];
  stepsBody?: string;
  success: boolean;
}

export const validateWorkout = async (workout: {
  title: string;
  steps: WorkoutItem[];
}) => {
  const t = await getTranslations("validate-workout");
  const errors: ValidationErrors = { steps: [], title: "", success: true };
  const titleErrors = await z
    .string()
    .min(4)
    .max(30)
    .safeParseAsync(workout.title);

  if (!titleErrors.success) {
    errors.title = titleErrors.error.issues[0]?.message;
    errors.success = false;
  }

  if (workout.steps.length < 1) {
    errors.success = false;
    errors.stepsBody = t("no-steps");
  }

  if (workout.steps.length > 100) {
    errors.success = false;
    errors.stepsBody = t("over-100-steps");
  }

  if (workout.steps) {
    for (const idx in workout.steps) {
      const step = workout.steps[idx];
      const result = await workoutStep.safeParseAsync(step);

      if (result.success) continue;

      errors.success = false;
      errors.steps.push({
        idx,
        error: result?.error?.formErrors?.fieldErrors,
      });
    }
  }

  return errors;
};
