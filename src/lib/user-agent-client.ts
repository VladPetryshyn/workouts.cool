"use client";
export const isMobileDeviceClient = () => {
  if (typeof window !== "undefined" && window) return window?.innerWidth < 760;
  return false;
};
