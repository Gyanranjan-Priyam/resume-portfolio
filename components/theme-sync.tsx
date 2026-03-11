"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ThemeSync() {
  const pathname = usePathname();

  // Apply system preference on every route change
  useEffect(() => {
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle("dark", dark);
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [pathname]);

  return null;
}
