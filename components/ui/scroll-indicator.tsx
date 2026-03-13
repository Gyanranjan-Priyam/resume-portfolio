"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.2,
  });

  useEffect(() => {
    const scheduleHide = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setIsVisible(false), 900);
    };

    const reveal = () => {
      setIsVisible(true);
      scheduleHide();
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      ) {
        reveal();
      }
    };

    scheduleHide();

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("wheel", reveal, { passive: true });
    window.addEventListener("touchmove", reveal, { passive: true });
    window.addEventListener("keydown", onKeydown);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("touchmove", reveal);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-70 hidden h-[52vh] w-px -translate-y-1/2 bg-foreground/15 md:block"
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 4 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 origin-top bg-foreground/60"
        style={{ scaleY: smoothProgress, height: "100%" }}
      />
    </motion.div>
  );
}
