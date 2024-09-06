"use server";

import { COOKIE_KEY } from "@/lib/constants";
import { cookies } from "next/headers";

export const logout = async () => {
  try {
    cookies().delete(COOKIE_KEY);
    return true;
  } catch {
    return false;
  }
};
