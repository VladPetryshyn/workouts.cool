import { getWorkout } from "@/actions/getWorkout";
import { PageLogic } from "./page-logic";

interface Props {
  params: {
    id: string;
  };
}

const getData = async (id: string) => {
  const workout = await getWorkout(id);

  return JSON.stringify(workout.steps);
};

export default async function WorkoutWorkoutPage({ params }: Props) {
  const steps = await getData(params.id);

  return (
    <PageLogic workoutId={params.id} steps={steps} />
  );
}
