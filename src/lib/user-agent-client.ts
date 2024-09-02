"use client";
export const isMobileDeviceClient = () => {
  if (typeof window === "undefined") return window?.innerWidth < 760;
  return false;
};
