import { FC } from "react";
import { timeFromMilis } from "@/lib/time";
import { OutlinedButton } from "@/components/buttons/outlined";
import Link from "next/link";
import "./styles.css";

interface Props {
  exerciseTime: number;
  position: string;
  workoutId: string;
}

export const ShowWorkoutResults: FC<Props> = ({
  exerciseTime,
  position,
  workoutId,
}) => {
  return (
    <div className="container workout-results">
      <div>
        <h1 className="displayFontH1">workout results</h1>
        <p className="result-item">
          Exercise Time: {timeFromMilis(exerciseTime)}
        </p>
        <p className="result-item">Position: {position}</p>
      </div>

      <Link href={`/workout/${workoutId}`}>
        <OutlinedButton text="To workout info" />
      </Link>
    </div>
  );
};
