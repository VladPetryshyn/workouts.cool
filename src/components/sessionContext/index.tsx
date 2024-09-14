"use client";
import { createContext, ReactNode, useEffect } from "react";
import { SessionActions, State, useSessionReducer } from "./reducer";
import { updateTokenUsername } from "@/lib/auth";

const defaultObj = {
  updateUsername: async (n: string) => {},
  triggerAnUpdate: () => {},
  logout: () => {},
  initStore: (n: State) => {},
  state: { valid: false } as State,
};

export const sessionContext = createContext(defaultObj);

export const SessionContextWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useSessionReducer();

  useEffect(() => {
    const url = new URL("/api/getSession", document.URL);
    const getUser = async () => {
      const response = await fetch(url.toString(), {
        method: "GET",
      });

      try {
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: SessionActions.INITIALIZE_STORE, payload: data });
        }
      } catch (e) {
        console.error(e);
      }
    };

    getUser();
  }, []);

  const updateUsername = async (newUsername: string) => {
    const reqResult = await updateTokenUsername(newUsername);
    if (reqResult)
      return dispatch({
        type: SessionActions.UPDATE_USERNAME,
        payload: newUsername,
      });

    throw new Error("Error occured during a username update");
  };

  const triggerAnUpdate = () =>
    dispatch({ type: SessionActions.TRIGGER_UPDATE });

  const logout = () => dispatch({ type: SessionActions.LOGOUT });

  const initStore = (data: State) =>
    dispatch({ type: SessionActions.INITIALIZE_STORE, payload: data });

  return (
    <sessionContext.Provider
      value={{ updateUsername, triggerAnUpdate, state, logout, initStore }}
    >
      {children}
    </sessionContext.Provider>
  );
};
