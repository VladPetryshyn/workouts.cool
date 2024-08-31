"use client";
import { createContext, ReactNode } from "react";
import {
  NotificationActions,
  NotificationTypes,
  useNotificationReducer,
} from "./reducer";
import "./styles.scss";
import { NotifItem } from "./notif-item";

const contextDefaultProps = {
  pushNotification: (text: string, type: NotificationTypes = NotificationTypes.DEFAULT) => {},
  popNotification() {},
};

export const NotificationsContext = createContext(contextDefaultProps);

interface Props {
  children: ReactNode;
}

export default function NotificationsComponent({ children }: Props) {
  const [state, dispatch] = useNotificationReducer();

  const pushNotification = (
    value: string,
    type: NotificationTypes = NotificationTypes.DEFAULT,
  ) =>
    dispatch({
      type: NotificationActions.PUSH,
      payload: { title: value, type },
    });
  const popNotification = () => dispatch({ type: NotificationActions.POP });

  return (
    <>
      <NotificationsContext.Provider
        value={{ pushNotification, popNotification }}
      >
        {children}
      </NotificationsContext.Provider>
      <div className="notifications-container">
        {state.map(({ title, id, type }) => (
          <>
            <NotifItem
              title={title}
              type={type}
              key={id}
              popNotification={popNotification}
            />
            <br />
          </>
        ))}
      </div>
    </>
  );
}
