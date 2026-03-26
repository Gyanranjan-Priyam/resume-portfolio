"use client";

import { useEffect } from "react";

export function ThemeSync() {
  // Only sync with system preference changes, respect user's manual choice
  useEffect(() => {
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle("dark", dark);
    };

    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      // User has manually set a theme, apply it
      apply(savedTheme === "dark");
    } else {
      // No saved preference, use system preference
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
    }

    // Listen for system preference changes only if user hasn't set a preference
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        apply(e.matches);
      }
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []); // Remove pathname dependency - don't reset on navigation

  return null;
}
