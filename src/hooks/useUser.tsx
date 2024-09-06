"use client";

import { SessionUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<SessionUser | undefined>();

  useEffect(() => {
    const url = new URL("/api/getSession", document.URL);
    const getUser = async () => {
      const response = await fetch(url.toString(), {
        method: "GET",
      });

      try {
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getUser();
  }, []);

  return user;
};
