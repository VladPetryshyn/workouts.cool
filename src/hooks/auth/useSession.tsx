"use client";

import { sessionContext } from "@/components/sessionContext";
import { useContext } from "react";

export const useSession = () => {
  const session = useContext(sessionContext);
  return session;
};
