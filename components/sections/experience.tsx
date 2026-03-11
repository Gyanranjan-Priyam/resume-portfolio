"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { experiences } from "@/data/experienceData";
import { BlurFade } from "@/components/ui/blur-fade";


function CloseIcon() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-muted-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
}

export function ExperienceSection() {
  const [active, setActive] = useState<
    (typeof experiences)[number] | null
  >(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <section id="experience" className="py-8">
      <BlurFade delay={0.04} inView>
      <h2 className="mb-6 text-3xl font-bold">Work Experience</h2>
      </BlurFade>

      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* Expanded card */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-100 grid place-items-center p-4">
            <motion.div
              layoutId={`card-${active.company}-${id}`}
              ref={ref}
              className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-lg"
            >
              <div className="flex items-start justify-between p-5">
                <div className="flex items-center gap-4">
                  <motion.div layoutId={`avatar-${active.company}-${id}`}>
                    <Avatar className="size-12 border">
                      <AvatarImage src={active.logo} alt={active.company} />
                      <AvatarFallback className="text-xs font-bold">
                        {active.initials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <motion.h3
                      layoutId={`company-${active.company}-${id}`}
                      className="text-md font-semibold"
                    >
                      {active.company}
                    </motion.h3>
                    <motion.p
                      layoutId={`title-${active.company}-${id}`}
                      className="text-md text-muted-foreground"
                    >
                      {active.title}
                    </motion.p>
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="border-t px-5 py-4">
                <motion.p
                  layoutId={`period-${active.company}-${id}`}
                  className="mb-3 text-sm font-medium text-muted-foreground"
                >
                  {active.period}
                </motion.p>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-md leading-relaxed text-muted-foreground"
                >
                  {Array.isArray(active.content) ? (
                    <ul className="space-y-2 list-none">
                      {active.content.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    active.content
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-1">
        {experiences.map((exp, i) => (
          <BlurFade key={exp.company} delay={0.04 + i * 0.05} inView>
          <motion.div
            layoutId={`card-${exp.company}-${id}`}
            key={exp.company}
            onClick={() => setActive(exp)}
            className="flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50"
          >
            <motion.div layoutId={`avatar-${exp.company}-${id}`}>
              <Avatar className="size-10 border">
                <AvatarImage src={exp.logo} alt={exp.company} />
                <AvatarFallback className="text-[10px] font-bold">
                  {exp.initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.p
                layoutId={`company-${exp.company}-${id}`}
                className="text-sm font-semibold leading-tight"
              >
                {exp.company}
              </motion.p>
              <motion.p
                layoutId={`title-${exp.company}-${id}`}
                className="text-xs text-muted-foreground"
              >
                {exp.title}
              </motion.p>
            </div>
            <motion.span
              layoutId={`period-${exp.company}-${id}`}
              className="shrink-0 text-xs text-muted-foreground text-right"
            >
              {exp.period}
            </motion.span>
          </motion.div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
