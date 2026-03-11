/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "@/components/loader-component";
import { useLoaderStore } from "@/components/loader-component";

const SESSION_KEY = "loader-intro-shown";

export function LoaderWrapper() {
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);
  const setIntroOut = useLoaderStore((s) => s.setIntroOut);
  const setIsLoading = useLoaderStore((s) => s.setIsLoading);
  const introOut = useLoaderStore((s) => s.introOut);

  // Decide whether to show the loader (read-only — never writes sessionStorage here)
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    const isHomePage = pathname === "/";

    if (isHomePage && !alreadyShown) {
      setShouldShow(true);
    } else {
      setIntroOut(true);
      setIsLoading(false);
      document.documentElement.classList.remove("loader-active");
    }
  }, [pathname, setIntroOut, setIsLoading]);

  // Persist to sessionStorage and reveal main after the animation finishes
  useEffect(() => {
    if (introOut) {
      sessionStorage.setItem(SESSION_KEY, "true");
      document.documentElement.classList.remove("loader-active");
    }
  }, [introOut]);

  // Unmount loader once the intro animation completes
  if (!shouldShow || introOut) return null;

  return (
    <Loader
      fullName="Gyanranjan Priyam"
      shortName="This is Priyam."
      layoutId="layout"
    />
  );
}
