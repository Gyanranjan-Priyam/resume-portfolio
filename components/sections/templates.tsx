"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ArrowRight, Globe, Github, X } from "lucide-react";
import Link from "next/link";
import templates from "@/data/templateData";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";

function ExpandedCard({
  active,
  id,
  onClose,
}: {
  active: (typeof templates)[number];
  id: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 h-full w-full z-10 touch-none"
        onClick={onClose}
      />
      <div className="fixed inset-0 grid place-items-center z-100 pointer-events-none p-4">
        <motion.div
          layoutId={`card-${active.title}-${id}`}
          ref={ref}
          className="pointer-events-auto relative w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-full md:h-auto md:max-h-[90vh] lg:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          <motion.button
            key={`button-${active.title}-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="absolute top-3 right-3 z-10 flex items-center justify-center bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full h-8 w-8 shadow-md hover:scale-110 transition-transform"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-black dark:text-white" />
          </motion.button>
          
          <div className="flex-shrink-0">
            <motion.div layoutId={`image-${active.title}-${id}`}>
              <Image
                src={active.img}
                alt={active.title}
                width={500}
                height={320}
                className="w-full h-60 md:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
              />
            </motion.div>
          </div>

          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-between items-start p-4 flex-shrink-0">
              <div>
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="font-bold text-neutral-700 dark:text-neutral-200"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.title}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {active.company} · {active.date}
                </motion.p>
              </div>
              <motion.a
                layoutId={`button-${active.title}-${id}`}
                href={active.link}
                className="px-4 py-3 text-sm rounded-full font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex-shrink-0"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Details
              </motion.a>
            </div>

            <div className="px-4 pb-6">
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-600 text-xs md:text-sm lg:text-base flex flex-col items-start gap-4 dark:text-neutral-400"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <p>{active.desc[0]}</p>
                {active.tech && active.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {active.tech.map((t: string) => (
                      <span
                        key={t}
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        className="rounded-full border border-neutral-300 dark:border-neutral-600 px-2.5 py-0.5 text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {active.liveLink && (
                    <a
                      href={active.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                      <Globe className="size-3.5" />{" "}
                      <span className="text-white">Live Demo</span>
                    </a>
                  )}
                  {active.github && (
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 transition-colors"
                    >
                      <Github className="size-3.5" /> <span>GitHub</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>,
    document.body,
  );
}

export function TemplatesSection() {
  const [active, setActive] = useState<(typeof templates)[number] | null>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    
    if (active) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [active]);

  const displayTemplates = templates.slice(0, 4);

  return (
    <section id="templates" className="py-8">
      <BlurFade delay={0.04} inView>
        <h2
          className="mb-6 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Templates
        </h2>
      </BlurFade>

      <AnimatePresence>
        {active && (
          <ExpandedCard
            active={active}
            id={id}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full gap-4">
        {displayTemplates.map((template, i) => (
          <BlurFade
            key={`card-${template.title}-${id}`}
            delay={0.04 + i * 0.05}
            inView
          >
            {/* Mobile layout – links directly to template page */}
            <Link href={template.link} className="block md:hidden">
              <div className="group rounded-lg border bg-card p-4 mb-4 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-sm font-semibold group-hover:underline"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {template.title}
                  </h3>
                  <span
                    className="shrink-0 text-sm text-muted-foreground whitespace-nowrap"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {template.date}
                  </span>
                </div>
                <p
                  className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {template.desc[0]}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.tech?.map((t: string) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="rounded-sm px-1.5 py-0.5 text-xs font-normal"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>

            {/* Desktop layout – expandable card */}
            <motion.div
              layoutId={`card-${template.title}-${id}`}
              onClick={() => setActive(template)}
              className="cursor-pointer hidden md:block"
            >
              <div className="flex p-4 justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
                <div className="flex gap-4 flex-row">
                  <motion.div layoutId={`image-${template.title}-${id}`}>
                    <Image
                      src={template.img}
                      alt={template.title}
                      className="h-14 w-14 rounded-lg object-cover object-top"
                      width={100}
                      height={100}
                    />
                  </motion.div>
                  <div>
                    <motion.h3
                      layoutId={`title-${template.title}-${id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 text-left"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {template.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${template.title}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-left"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {template.company}
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${template.title}-${id}`}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-amber-500 hover:text-white text-black"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Details
                </motion.button>
              </div>
            </motion.div>
          </BlurFade>
        ))}
      </ul>

      <BlurFade delay={0.3} inView>
        <Link
          href="/templates"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          View All <ArrowRight className="size-3.5" />
        </Link>
      </BlurFade>
    </section>
  );
}
