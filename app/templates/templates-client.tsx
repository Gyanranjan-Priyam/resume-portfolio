/* eslint-disable react-hooks/rules-of-hooks */
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

const TEMPLATES_PER_PAGE_GRID = 6;
const TEMPLATES_PER_PAGE_LIST = 4;

interface Template {
  id: string;
  title: string;
  img: string;
  date: string;
  desc: string[];
  tech: string[];
  company?: string;
  category: string;
}

interface TemplatesClientProps {
  templates: Template[];
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

export function TemplatesClient({ templates }: TemplatesClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 150);

  const templatesPerPage = viewMode === "grid" ? TEMPLATES_PER_PAGE_GRID : TEMPLATES_PER_PAGE_LIST;
  const totalPages = Math.ceil(templates.length / templatesPerPage);

  useEffect(() => {
    const newTotalPages = Math.ceil(templates.length / templatesPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [viewMode, templates.length, templatesPerPage, currentPage]);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * templatesPerPage;
    const endIndex = startIndex + templatesPerPage;
    return templates.slice(startIndex, endIndex);
  }, [templates, currentPage, templatesPerPage]);

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

  const allCategories = useMemo(
    () => Array.from(new Set(templates.map((t) => t.category))).sort(),
    [templates]
  );

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

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setActiveCategory(null);
    }
  }, [isSearchOpen]);

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

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory = activeCategory ? template.category === activeCategory : true;
      if (!debouncedQuery.trim()) return matchesCategory;

      const q = debouncedQuery.toLowerCase();
      const matchesQuery =
        template.title.toLowerCase().includes(q) ||
        template.desc[0].toLowerCase().includes(q) ||
        template.tech.some((tech) => tech.toLowerCase().includes(q));

      return matchesQuery && matchesCategory;
    });
  }, [templates, debouncedQuery, activeCategory]);

  const hasActivity = debouncedQuery.trim().length > 0 || activeCategory !== null;

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveCategory(null);
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
                Website Templates
              </h1>
              <p
                className="text-muted-foreground font-medium tracking-tight"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Pre-built website templates ready to customize and deploy for your projects.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4 mt-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search templates"
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
            {paginatedTemplates.map((template, i) => (
              <BlurFade key={template.id} delay={0.12 + i * 0.05} inView>
                <Link
                  href={`/templates/${template.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={template.img}
                      alt={template.title}
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
                        {template.title}
                      </h2>
                      <span
                        className="shrink-0 text-xs text-muted-foreground"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {template.date}
                      </span>
                    </div>
                    <p
                      className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2 tracking-tight"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {template.desc[0]}
                    </p>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedTemplates.map((template, i) => (
              <BlurFade key={template.id} delay={0.12 + i * 0.05} inView>
                <Link
                  href={`/templates/${template.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card p-4 sm:p-5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2
                          className="text-base sm:text-lg font-semibold group-hover:underline"
                          style={{ fontFamily: "var(--font-ibm)" }}
                        >
                          {template.title}
                        </h2>
                        {template.company && (
                          <Badge variant="secondary" className="text-xs">
                            {template.company}
                          </Badge>
                        )}
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2 tracking-tight"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {template.desc[0]}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                          {template.date}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {template.tech.slice(0, 6).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {template.tech.length > 6 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{template.tech.length - 6} more
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
            </div>
          </BlurFade>
        )}

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsSearchOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed left-1/2 top-20 z-50 w-[min(95vw,36rem)] -translate-x-1/2 rounded-xl border bg-background p-4 shadow-2xl"
              >
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full rounded-lg border bg-background py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  />
                  {hasActivity && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-muted"
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Filter by category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          activeCategory === category
                            ? "border-foreground bg-foreground text-background"
                            : "hover:bg-muted"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredTemplates.length > 0 ? (
                    <div className="space-y-2">
                      {filteredTemplates.slice(0, 6).map((template) => (
                        <Link
                          key={template.id}
                          href={`/templates/${template.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                        >
                          <h3
                            className="text-sm font-semibold"
                            style={{ fontFamily: "var(--font-ibm)" }}
                          >
                            <HighlightText text={template.title} query={debouncedQuery} />
                          </h3>
                          <p
                            className="mt-1 line-clamp-1 text-xs text-muted-foreground"
                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                          >
                            <HighlightText text={template.desc[0]} query={debouncedQuery} />
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No templates found
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
