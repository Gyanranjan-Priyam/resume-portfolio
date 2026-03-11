"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useLoaderStore } from "@/components/loader-component";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const setLenis = useLoaderStore((s) => s.setLenis);
  const isLoading = useLoaderStore((s) => s.isLoading);
  const introOut = useLoaderStore((s) => s.introOut);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    setLenis(lenis);

    // Only stop scrolling if the loader intro is actively playing
    if (isLoading && !introOut) {
      lenis.stop();
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [setLenis, isLoading, introOut]);

  return <>{children}</>;
}
