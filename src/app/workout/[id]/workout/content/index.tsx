"use client";
import { OutlinedButton } from "@/components/buttons/outlined";
import { timeFromMilis } from "@/lib/time";
import { FC, useEffect, useState } from "react";
import "./styles.css";

interface Props {
  skipStep: () => void;
  showResults: () => void;
  totalTime: number;
  title: string;
  description: string;
  position: string;
}

export const WorkoutContent: FC<Props> = ({
  skipStep,
  showResults,
  totalTime,
  title,
  description,
  position,
}) => {
  return (
    <div className="content-container container">
      <div className="content-container-content">
        <h2 className="content-container-position content-center">
          {position}
        </h2>
        <h3 className="content-container-title content-center">{title}</h3>
        <p className="content-container-description content-center">
          {description}
        </p>
        <h1 className="content-container-time displayFontH1 content-center">
          {timeFromMilis(totalTime)}
        </h1>
      </div>
      <div className="content-container-buttons">
        <OutlinedButton text="Skip step" onClick={skipStep} />
        <OutlinedButton text="End Exercise" onClick={showResults} />
      </div>
    </div>
  );
};
