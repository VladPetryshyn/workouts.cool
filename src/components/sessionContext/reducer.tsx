import { useReducer } from "react";

export enum SessionActions {
  UPDATE_USERNAME = "UPDATE_USERNAME",
  TRIGGER_UPDATE = "TRIGGER_UPDATE",
  INITIALIZE_STORE = "INITIALIZE_STORE",
  LOGOUT = "LOGOUT",
}

export type State = {
  id?: string;
  username?: string;
  updateTrigger?: boolean;
  valid: boolean;
};

interface updateUsername {
  type: SessionActions.UPDATE_USERNAME;
  payload: string;
}

interface triggerAnUpdate {
  type: SessionActions.TRIGGER_UPDATE;
}

interface initializeStore {
  type: SessionActions.INITIALIZE_STORE;
  payload: State;
}

interface logout {
  type: SessionActions.LOGOUT;
}

type Actions = initializeStore | triggerAnUpdate | updateUsername | logout;

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case SessionActions.TRIGGER_UPDATE:
      return {
        ...state,
        updateTrigger: !state.updateTrigger,
      };
    case SessionActions.UPDATE_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case SessionActions.INITIALIZE_STORE:
      return { ...state, ...action.payload, valid: true };
    case SessionActions.LOGOUT:
      return { valid: false };
    default:
      return state;
  }
};

export const useSessionReducer = () => {
  const [state, dispatch] = useReducer(reducer, { valid: false });

  return [state, dispatch] as [typeof state, typeof dispatch];
};
