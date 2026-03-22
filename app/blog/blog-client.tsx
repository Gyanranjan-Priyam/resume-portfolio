"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { Home, Search, X, Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import blogs from "@/data/blogsData";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "motion/react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags))).sort();

export default function BlogPageClient() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 150);

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
      setActiveTag(null);
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

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesTag = activeTag ? blog.tags.includes(activeTag) : true;
      if (!debouncedQuery.trim()) return matchesTag;

      const q = debouncedQuery.toLowerCase();
      const matchesQuery =
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesQuery && matchesTag;
    });
  }, [debouncedQuery, activeTag]);

  const hasActivity = debouncedQuery.trim().length > 0 || activeTag !== null;

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveTag(null);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <BlurFade delay={0.04}>
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1
                className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Blog
              </h1>
              <p
                className="font-medium tracking-tight text-muted-foreground"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Thoughts on web development, engineering, and the journey of
                building things.
              </p>
            </div>
            <div className="ml-4 mt-1 flex shrink-0 items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search posts"
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Search className="size-4" />
              </button>
              <Link
                href="/blog/feed.xml"
                aria-label="RSS Feed"
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Rss className="size-4" />
              </Link>
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

        {/* Blog listing */}
        <div className="space-y-4">
          {blogs.map((blog, i) => (
            <BlurFade key={blog.id} delay={0.12 + i * 0.05} inView>
              <Link
                href={`/blog/${blog.id}`}
                className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2
                    className="text-md font-semibold tracking-tight group-hover:underline"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    {blog.title}
                  </h2>
                  <span
                    className="shrink-0 whitespace-nowrap text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {formatDate(blog.date)}
                  </span>
                </div>
                <p
                  className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed tracking-tight text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {blog.excerpt}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-sm px-1.5 py-0 text-[10px] font-normal"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
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
                    placeholder="Search posts by title, tag, or topic..."
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

                {/* Tag Pills & Results — only shown when user has typed or selected a tag */}
                <AnimatePresence>
                  {hasActivity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 border-b px-4 py-2.5">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() =>
                              setActiveTag(activeTag === tag ? null : tag)
                            }
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                              activeTag === tag
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      {/* Results */}
                      <div className="max-h-[50vh] overflow-y-auto">
                        <AnimatePresence mode="popLayout">
                          {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                              <motion.div
                                key={blog.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Link
                                  href={`/blog/${blog.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="group block border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <h3
                                      className="text-sm font-semibold tracking-tight group-hover:underline"
                                      style={{ fontFamily: "var(--font-ibm)" }}
                                    >
                                      <HighlightText
                                        text={blog.title}
                                        query={debouncedQuery}
                                      />
                                    </h3>
                                    <span
                                      className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
                                      style={{
                                        fontFamily: "var(--font-jetbrains-mono)",
                                      }}
                                    >
                                      {formatDate(blog.date)}
                                    </span>
                                  </div>
                                  <p
                                    className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed tracking-tight text-muted-foreground"
                                    style={{
                                      fontFamily: "var(--font-jetbrains-mono)",
                                    }}
                                  >
                                    <HighlightText
                                      text={blog.excerpt}
                                      query={debouncedQuery}
                                    />
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {blog.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="rounded-sm px-1.5 py-0 text-[10px] font-normal"
                                        style={{
                                          fontFamily: "var(--font-jetbrains-mono)",
                                        }}
                                      >
                                        <HighlightText
                                          text={tag}
                                          query={debouncedQuery}
                                        />
                                      </Badge>
                                    ))}
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
                                No posts found for &ldquo;
                                {debouncedQuery || activeTag}&rdquo;
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
