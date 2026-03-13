/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useLoaderStore } from "@/components/loader-component";

export function ScrollToTopButton() {
  const lenis = useLoaderStore((s) => s.lenis);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.16);
  });

  const handleScrollTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={handleScrollTop}
          style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999 }}
          className="cursor-pointer inline-flex h-12 w-12 items-center justify-center rounded-full border border-white bg-background/85 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background"
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.94 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>,
    document.body
  );
}