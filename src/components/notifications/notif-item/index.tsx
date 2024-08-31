"use client";
import { FC, useEffect, useState } from "react";
import { NotificationTypes } from "../reducer";
import "./styles.scss";
import classNames from "classnames";

interface Props {
  title: string;
  type: NotificationTypes;
  popNotification: () => void;
}

export const NotifItem: FC<Props> = ({ title, type, popNotification }) => {
  const [time, setTime] = useState(3);

  // remove item after 3 seconds
  useEffect(() => {
    if (time === 0) popNotification();

    const timeout = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return (
    <div
      className={classNames("notification-item", {
        "error-item": type === NotificationTypes.ERROR,
        "success-item": type === NotificationTypes.SUCCESS,
      })}
    >
      <p className="notification-item-text">{title}</p>
    </div>
  );
};
