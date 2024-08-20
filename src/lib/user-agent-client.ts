"use client";
export const isMobileDeviceClient = () => {
  if (window) return window?.innerWidth < 760;
  return false;
};
