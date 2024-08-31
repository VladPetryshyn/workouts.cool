"use client";
import { FC, MouseEventHandler, useEffect } from "react";
import "./styles.scss";

interface Time {
  title: string;
  millis: number;
}

const timeGeneration = (multiplier: number, startFrom = 0) => {
  const arr: Array<Time> = [];
  for (let i = startFrom; i <= 60; i++) {
    if (i < 10) {
      arr.push({ title: `0${i}`, millis: multiplier * i });
      continue;
    }
    arr.push({ title: `${i}`, millis: multiplier * i });
  }

  return arr;
};
const minTime = timeGeneration(60000);
const secTime = timeGeneration(1000, 30);

interface Props {
  onHide: () => void;
  selectedMins?: number;
  selectedSecs?: number;
  updateMins: (time: number) => void;
  updateSecs: (time: number) => void;
}

export const TimeSelect: FC<Props> = (props) => {
  const { onHide, selectedSecs, selectedMins } = props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.onclick = (e) => {
        e.preventDefault();
        onHide();
      };
    }, 0);

    return () => {
      clearTimeout(timeout);
      window.onclick = () => {};
    };
  }, []);

  const stopPropagation: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="content-time-selector-btn-time" onClick={stopPropagation}>
      <div className="content-time-selector-btn-time-container">
        <div className="content-time-selector-btn-time-itm">
          {minTime.map(({ title, millis }) => (
            <button
              className={`item ${millis === selectedMins && "active"}`}
              key={title}
              onClick={() => props.updateMins(millis)}
            >
              <p>{title}</p>
            </button>
          ))}
        </div>
        <div className="content-time-selector-btn-time-itm">
          {secTime.map(({ title, millis }) => (
            <button
              className={`item ${millis === selectedSecs && "active"}`}
              key={title}
              onClick={() => props.updateSecs(millis)}
            >
              <p>{title}</p>
            </button>
          ))}
        </div>
      </div>
      <button
        className="item content-time-selector-btn-time-ok"
        onClick={onHide}
      >
        <p>OK</p>
      </button>
    </div>
  );
};
