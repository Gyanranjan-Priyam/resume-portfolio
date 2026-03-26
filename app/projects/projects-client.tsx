/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, LayoutGrid, List, Calendar, ArrowRight, Search, X } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PROJECTS_PER_PAGE_GRID = 6;
const PROJECTS_PER_PAGE_LIST = 4;

interface Project {
  id: string;
  title: string;
  img: string;
  date: string;
  desc: string[];
  tech: string[];
  company?: string;
}

interface ProjectsClientProps {
  projects: Project[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-yellow-200/80 text-inherit rounded-sm px-0.5 dark:bg-yellow-500/30"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 150);

  // Get projects per page based on view mode
  const projectsPerPage = viewMode === "grid" ? PROJECTS_PER_PAGE_GRID : PROJECTS_PER_PAGE_LIST;

  // Calculate total pages
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Reset to page 1 when view mode changes if current page exceeds new total
  useEffect(() => {
    const newTotalPages = Math.ceil(projects.length / projectsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [viewMode, projects.length, projectsPerPage, currentPage]);

  // Get paginated projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projects.slice(startIndex, endIndex);
  }, [projects, currentPage, projectsPerPage]);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Extract all unique tech stacks from projects
  const allTechStacks = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tech))).sort(),
    [projects]
  );

  // "/" to open, Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !isSearchOpen &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Auto-focus & reset on close
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setActiveTech(null);
    }
  }, [isSearchOpen]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTech = activeTech ? project.tech.includes(activeTech) : true;
      if (!debouncedQuery.trim()) return matchesTech;

      const q = debouncedQuery.toLowerCase();
      const matchesQuery =
        project.title.toLowerCase().includes(q) ||
        project.desc[0].toLowerCase().includes(q) ||
        project.tech.some((tech) => tech.toLowerCase().includes(q));

      return matchesQuery && matchesTech;
    });
  }, [projects, debouncedQuery, activeTech]);

  const hasActivity = debouncedQuery.trim().length > 0 || activeTech !== null;

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveTech(null);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <BlurFade delay={0.04}>
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1
                className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Projects and Templates
              </h1>
              <p
                className="text-muted-foreground font-medium tracking-tight"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Things I&apos;ve built — from full-stack platforms to community
                tools along with some helpful templates.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4 mt-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search projects"
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <Search className="size-4" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                {viewMode === "grid" ? (
                  <List className="size-4" />
                ) : (
                  <LayoutGrid className="size-4" />
                )}
              </button>
              <Link
                href="/"
                aria-label="Home"
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Home className="size-4" />
              </Link>
            </div>
          </div>
        </BlurFade>

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedProjects.map((project, i) => (
              <BlurFade key={project.id} delay={0.12 + i * 0.05} inView>
                <Link
                  href={`/projects/${project.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={project.img}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className="text-md font-semibold group-hover:underline"
                        style={{ fontFamily: "var(--font-ibm)" }}
                      >
                        {project.title}
                      </h2>
                      <span
                        className="shrink-0 text-xs text-muted-foreground"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {project.date}
                      </span>
                    </div>
                    <p
                      className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2 tracking-tight"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {project.desc[0]}
                    </p>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedProjects.map((project, i) => (
              <BlurFade key={project.id} delay={0.12 + i * 0.05} inView>
                <Link
                  href={`/projects/${project.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card p-4 sm:p-5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2
                          className="text-base sm:text-lg font-semibold group-hover:underline"
                          style={{ fontFamily: "var(--font-ibm)" }}
                        >
                          {project.title}
                        </h2>
                        {project.company && (
                          <Badge variant="secondary" className="text-xs">
                            {project.company}
                          </Badge>
                        )}
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2 tracking-tight"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {project.desc[0]}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                          {project.date}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 6).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.tech.length > 6 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{project.tech.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 mt-1" />
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <BlurFade delay={0.3} inView>
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p
                className="mt-3 text-center text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Page {currentPage} of {totalPages} · {projects.length} projects
              </p>
            </div>
          </BlurFade>
        )}
      </div>

      {/* Spotlight Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xl"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-[10vh] z-50 mx-auto w-full max-w-xl px-4"
            >
              <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
                {/* Search Input */}
                <div className={`flex items-center gap-3 px-4 py-3${hasActivity ? " border-b" : ""}`}>
                  <Search className="size-5 shrink-0 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects by title, tech stack, or topic..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                  <kbd className="hidden shrink-0 items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                    ESC
                  </kbd>
                </div>

                {/* Tech Pills & Results — only shown when user has typed or selected a tech */}
                <AnimatePresence>
                  {hasActivity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 border-b px-4 py-2.5">
                        {allTechStacks.map((tech) => (
                          <button
                            key={tech}
                            onClick={() =>
                              setActiveTech(activeTech === tech ? null : tech)
                            }
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                              activeTech === tech
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>

                      {/* Results */}
                      <div className="max-h-[50vh] overflow-y-auto">
                        <AnimatePresence mode="popLayout">
                          {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                              <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Link
                                  href={`/projects/${project.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="group block border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <h3
                                      className="text-sm font-semibold tracking-tight group-hover:underline"
                                      style={{ fontFamily: "var(--font-ibm)" }}
                                    >
                                      <HighlightText
                                        text={project.title}
                                        query={debouncedQuery}
                                      />
                                    </h3>
                                    <span
                                      className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
                                      style={{
                                        fontFamily: "var(--font-jetbrains-mono)",
                                      }}
                                    >
                                      {project.date}
                                    </span>
                                  </div>
                                  <p
                                    className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed tracking-tight text-muted-foreground"
                                    style={{
                                      fontFamily: "var(--font-jetbrains-mono)",
                                    }}
                                  >
                                    <HighlightText
                                      text={project.desc[0]}
                                      query={debouncedQuery}
                                    />
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {project.tech.slice(0, 6).map((tech) => (
                                      <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="rounded-sm px-1.5 py-0 text-[10px] font-normal"
                                        style={{
                                          fontFamily: "var(--font-jetbrains-mono)",
                                        }}
                                      >
                                        <HighlightText
                                          text={tech}
                                          query={debouncedQuery}
                                        />
                                      </Badge>
                                    ))}
                                    {project.tech.length > 6 && (
                                      <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1.5 py-0 text-[10px] font-normal"
                                        style={{
                                          fontFamily: "var(--font-jetbrains-mono)",
                                        }}
                                      >
                                        +{project.tech.length - 6} more
                                      </Badge>
                                    )}
                                  </div>
                                </Link>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="px-4 py-8 text-center"
                            >
                              <p
                                className="text-sm text-muted-foreground"
                                style={{
                                  fontFamily: "var(--font-jetbrains-mono)",
                                }}
                              >
                                No projects found for &ldquo;
                                {debouncedQuery || activeTech}&rdquo;
                              </p>
                              <button
                                onClick={clearSearch}
                                className="mt-3 rounded-lg bg-muted px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
                                style={{
                                  fontFamily: "var(--font-jetbrains-mono)",
                                }}
                              >
                                Clear search
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard hint */}
              <p className="mt-3 text-center text-xs text-muted-foreground/60">
                Press{" "}
                <kbd className="rounded border px-1 py-0.5 text-[10px]">
                  /
                </kbd>{" "}
                to search ·{" "}
                <kbd className="rounded border px-1 py-0.5 text-[10px]">
                  ESC
                </kbd>{" "}
                to close
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
