"use client";
export const isMobileDeviceClient = () => {
  try {
  if (window) return window?.innerWidth < 760;
  return false;
  } catch {
    return false;
  }
};
