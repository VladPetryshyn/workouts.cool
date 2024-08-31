import Image from "next/image";
import { FC } from "react";
import "./styles.scss";

interface Props {
  icon: "clock" | "dumbell";
  iconSize?: number;
  title: string;
  content: string;
}

export const WorkoutPreviewCard: FC<Props> = ({
  icon,
  iconSize = 40,
  content,
  title,
}) => {
  return (
    <div className="preview-card">
      <div className="preview-card-title">
        <Image
          src={`/workout-preview/${icon}.svg`}
          width={iconSize}
          height={iconSize}
          alt="Preview Card Icon"
        />
        <h3>{title}</h3>
      </div>
      <p className="preview-card-content">{content}</p>
    </div>
  );
};
