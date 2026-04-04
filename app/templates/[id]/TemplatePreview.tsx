"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface TemplatePreviewProps {
  title: string;
  liveLink: string;
  desktopImage?: string;
  mobileImage?: string;
}

export function TemplatePreview({ title, liveLink, desktopImage, mobileImage }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  
  // If no images provided, show iframe fallback
  if (!desktopImage && !mobileImage) {
    return (
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
        {/* Browser Chrome */}
        <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#FF5F57]" />
            <div className="size-3 rounded-full bg-[#FEBC2E]" />
            <div className="size-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Monitor className="size-3 text-muted-foreground" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              {liveLink}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-950 aspect-video overflow-hidden">
          <iframe
            src={liveLink}
            title={`${title} Preview`}
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mb-4 mx-auto">
        <button
          onClick={() => setViewMode("desktop")}
          aria-pressed={viewMode === "desktop"}
          aria-label="Switch to desktop view"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === "desktop"
              ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <Monitor className="size-4" />
          Desktop
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          aria-pressed={viewMode === "mobile"}
          aria-label="Switch to mobile view"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === "mobile"
              ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <Smartphone className="size-4" />
          Mobile
        </button>
      </div>

      {/* Preview Area */}
      <AnimatePresence mode="wait">
        {viewMode === "desktop" && desktopImage ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
              {/* Browser Chrome */}
              <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#FF5F57]" />
                  <div className="size-3 rounded-full bg-[#FEBC2E]" />
                  <div className="size-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <Monitor className="size-3 text-muted-foreground" />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                    {liveLink}
                  </span>
                </div>
              </div>
              
              {/* Desktop Screenshot */}
              <div className="bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
                <Image
                  src={desktopImage}
                  alt={`${title} Desktop View`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>
        ) : viewMode === "mobile" && mobileImage ? (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            {/* Phone Frame */}
            <div className="relative" style={{ width: "min(100%, 320px)" }}>
              <div className="relative bg-black rounded-[36px] p-2 shadow-2xl border-8 border-neutral-800">
                {/* Notch/Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-10" />
                
                {/* Phone Screen */}
                <div className="relative bg-white dark:bg-neutral-950 rounded-[28px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="px-6 py-2 flex items-center justify-between text-[10px] font-medium bg-white dark:bg-neutral-950 relative z-10">
                    <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>9:41</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span>📶</span>
                      <span>📡</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  {/* Mobile Screenshot */}
                  <div className="overflow-hidden bg-white dark:bg-neutral-950">
                    <Image
                      src={mobileImage}
                      alt={`${title} Mobile View`}
                      width={390}
                      height={844}
                      className="w-full h-auto"
                      priority
                    />
                  </div>

                  {/* Home Indicator */}
                  <div className="py-2 flex justify-center bg-white dark:bg-neutral-950">
                    <div className="w-32 h-1 bg-neutral-800 dark:bg-neutral-400 rounded-full" />
                  </div>
                </div>

                {/* Side Buttons (Decorative) */}
                <div className="absolute -left-2 top-20 w-1 h-8 bg-neutral-700 rounded-l" />
                <div className="absolute -left-2 top-32 w-1 h-12 bg-neutral-700 rounded-l" />
                <div className="absolute -left-2 top-48 w-1 h-12 bg-neutral-700 rounded-l" />
                <div className="absolute -right-2 top-28 w-1 h-16 bg-neutral-700 rounded-r" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* Caption */}
      <p className="mt-3 text-xs text-center text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
        {viewMode === "desktop" ? "Desktop" : "Mobile"} view of {title}
      </p>
    </div>
  );
}
