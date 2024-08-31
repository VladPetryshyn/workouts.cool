import { useReducer } from "react";

export enum NotificationTypes {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  DEFAULT = "DEFAULT",
}

export enum NotificationActions {
  PUSH = "PUSH",
  POP = "POP",
}

type Action =
  | {
      type: NotificationActions.PUSH;
      payload: { title: string; type: NotificationTypes };
    }
  | { type: NotificationActions.POP };

type State = { title: string; id: number; type: NotificationTypes }[];

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case NotificationActions.PUSH:
      return [...state, { ...action.payload, id: Math.random() }];
    case NotificationActions.POP:
      return state.slice(1);
    default:
      return state;
  }
};

export const useNotificationReducer = () => {
  const [state, dispatch] = useReducer(reducer, [
  ]);

  return [state, dispatch] as [typeof state, typeof dispatch];
};
