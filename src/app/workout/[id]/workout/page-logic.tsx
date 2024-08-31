"use client";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "./countdown";
import "./styles.css";
import { WorkoutItem } from "@/models/Workout";
import { WorkoutContent } from "./content";
import { ShowWorkoutResults } from "./results";
import { PermModal } from "./perm-modal";

interface Props {
  workoutId: string;
  steps: string;
}

export const PageLogic = (props: Props) => {
  const audio = useRef(new Audio("/audio/countdown.wav"));
  const [isPermModalShown, setIsPermModalShown] = useState(false);
  const [workouts, setWorkouts] = useState<Array<WorkoutItem>>([]);
  const [currIdx, setCurrIdx] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>();
  const exerciseTime = useRef<number>(0);
  const exercisesFinished = useRef<number>(0);

  const skipStep = () => {
    if (currIdx + 1 === workouts.length) return setIsFinished(true);
    setCurrIdx((i) => i + 1);
    setTime(workouts[currIdx + 1].totalTime);
    if (interval.current) clearInterval(interval?.current);
  };

  const showResults = () => {
    if (interval.current) clearInterval(interval?.current);
    setIsFinished(true);
  };

  useEffect(() => {
    setWorkouts(JSON.parse(props.steps));
    const effectAudio = audio.current;

    effectAudio.play().catch(() => {
      effectAudio.currentTime = 0;
      effectAudio.pause();
      setIsPermModalShown(true);
    });

    return () => {
      effectAudio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onModalClose = () => {
    setIsPermModalShown(false);
  };

  const onModalAgree = () => {
    audio?.current?.play().catch();
    onModalClose();
  };

  useEffect(() => {
    if (currIdx > -1) {
      if (time === 0) {
        skipStep();
        exercisesFinished.current++;
      }

      if (time === 3000) audio.current.play().catch();

      interval.current = setTimeout(() => {
        setTime((time) => time - 1000);
        exerciseTime.current += 1000;
      }, 1000);

      return () => {
        if (interval.current) clearTimeout(interval.current);
      };
    }
  }, [time, currIdx]);

  useEffect(() => {
    if (interval.current && isFinished) clearTimeout(interval.current);
  }, [isFinished]);

  const position = (pos: number) => `${pos}/${workouts.length}`;
  const workout = currIdx > -1 ? workouts[currIdx] : undefined;

  return (
    <main>
      {currIdx < 0 && !isPermModalShown && <Countdown skipStep={skipStep} />}
      {workout && !isFinished && (
        <WorkoutContent
          totalTime={time}
          skipStep={skipStep}
          showResults={showResults}
          title={workout.title || "just a placeholder"}
          description={workout.description || "just a plceholder"}
          position={position(currIdx + 1)}
        />
      )}
      {isFinished && (
        <ShowWorkoutResults
          position={position(exercisesFinished.current)}
          exerciseTime={exerciseTime.current}
          workoutId={props.workoutId}
        />
      )}
      {isPermModalShown && (
        <PermModal closeModal={onModalClose} onModalAgree={onModalAgree} />
      )}
    </main>
  );
};
