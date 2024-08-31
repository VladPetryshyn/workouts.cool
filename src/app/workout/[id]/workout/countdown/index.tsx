"use client";
import { FC, useEffect, useState } from "react";
import "./styles.css";

interface Props {
  skipStep: () => void;
}

export const Countdown: FC<Props> = ({ skipStep }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) skipStep();
    const timeout = setTimeout(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [count]);

  return (
    <div className="countdown container">
      <h1 className="displayFontH1">{count}</h1>
    </div>
  );
};
