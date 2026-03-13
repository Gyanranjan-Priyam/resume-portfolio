"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.2,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-70 hidden h-[52vh] w-px -translate-y-1/2 bg-foreground/15 md:block"
    >
      <motion.div
        className="absolute inset-x-0 top-0 origin-top bg-foreground/60"
        style={{ scaleY: smoothProgress, height: "100%" }}
      />
    </div>
  );
}
