"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ArrowRight, Globe, Github } from "lucide-react";
import Link from "next/link";
import projects from "@/data/projectsData";
import { Badge } from "@/components/ui/badge";

const CloseIcon = () => (
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
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

export function ProjectsSection() {
  const [active, setActive] = useState<(typeof projects)[number] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const displayProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Projects</h2>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-100">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 sm:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-125 h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.img}
                  alt={active.title}
                  className="w-full h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.title}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.company} · {active.date}
                    </motion.p>
                  </div>
                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.link}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    Details
                  </motion.a>
                </div>

                <div className="pt-2 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <p>{active.desc[0]}</p>
                    {active.tech && active.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {active.tech.map((t: string) => (
                          <span
                            key={t}
                            className="rounded-full border border-neutral-300 dark:border-neutral-600 px-2.5 py-0.5 text-[11px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {active.liveLink && (
                        <a
                          href={active.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                        >
                          <Globe className="size-3.5" /> <span className="text-white">Live Demo</span>
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
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full gap-4">
        {displayProjects.map((project) => (
          <motion.div
            layoutId={`card-${project.title}-${id}`}
            key={`card-${project.title}-${id}`}
            onClick={() => setActive(project)}
            className="cursor-pointer"
          >
            {/* Mobile layout – matches blog section style */}
            <div className="group md:hidden rounded-lg border bg-card p-4 mb-4 transition-colors hover:bg-muted/50">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-semibold group-hover:underline">
                  {project.title}
                </h3>
                <span className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">
                  {project.date}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {project.desc[0]}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.tech?.map((t: string) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="rounded-sm px-1.5 py-0.5 text-xs font-normal"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Desktop layout – existing expandable card */}
            <div className="hidden md:flex p-4 justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
              <div className="flex gap-4 flex-row">
                <motion.div layoutId={`image-${project.title}-${id}`}>
                  <img
                    src={project.img}
                    alt={project.title}
                    className="h-14 w-14 rounded-lg object-cover object-top"
                  />
                </motion.div>
                <div>
                  <motion.h3
                    layoutId={`title-${project.title}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-left"
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${project.title}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-left"
                  >
                    {project.company}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${project.title}-${id}`}
                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black"
              >
                Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </ul>

      <Link
        href="/projects"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        View All <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
