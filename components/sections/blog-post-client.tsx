"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";

/* ── Types ── */
type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
  date: string;
  updatedAt?: string;
  tags: string[];
};

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getShareUrl(platform: string, url: string, title: string) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encoded}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`;
    default:
      return null;
  }
}

/* ── SVG Icons ── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ReadAloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ── Main Component ── */
export function BlogPostClient({
  blog,
  nextBlog,
}: {
  blog: Blog;
  nextBlog: { id: string; title: string; date: string };
}) {
  const [isReading, setIsReading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const headings = useMemo(
    () => blog.content.filter((b) => b.type === "heading").map((b) => (b as { type: "heading"; text: string }).text),
    [blog]
  );

  const blogUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = useCallback(
    (platform: string) => {
      const url = getShareUrl(platform, blogUrl, blog.title);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      setShareOpen(false);
    },
    [blogUrl, blog.title]
  );

  const getArticleText = useCallback(() => {
    const parts = [blog.title, blog.excerpt];
    blog.content.forEach((block) => {
      if (block.type === "heading" || block.type === "paragraph") {
        parts.push(block.text);
      } else if (block.type === "list") {
        block.items.forEach((item: string) => parts.push(item));
      }
    });
    return parts.join(". ");
  }, [blog]);

  const handleReadAloud = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const text = getArticleText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [isReading, getArticleText]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Close share popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    if (shareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);

  const scrollToHeading = useCallback((headingText: string) => {
    const els = document.querySelectorAll("[data-heading]");
    els.forEach((el) => {
      if (el.getAttribute("data-heading") === headingText) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr_200px]">
          {/* ── Left Sidebar: Table of Contents ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-12">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On This Page
              </h3>
              <ul className="space-y-1.5 border-l border-border">
                {headings.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      onClick={() => scrollToHeading(h)}
                      className="block w-full pl-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:text-foreground hover:border-l-foreground -ml-px border-l border-transparent"
                    >
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <article className="mx-auto w-full max-w-2xl">
            {/* Breadcrumb */}
            <BlurFade delay={0.04}>
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
              <ChevronRight className="size-3.5" />
              <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
              <ChevronRight className="size-3.5" />
              <span className="truncate text-foreground font-medium">{blog.title}</span>
            </nav>
            </BlurFade>

            {/* Title */}
            <BlurFade delay={0.08}>
            <h1 className="text-4xl font-bold tracking-tight leading-snug mb-4">
              {blog.title}
            </h1>
            </BlurFade>

            {/* Excerpt */}
            <BlurFade delay={0.12}>
            <p className="text-base leading-relaxed text-muted-foreground mb-5">
              {blog.excerpt}
            </p>
            </BlurFade>

            {/* Meta row */}
            <BlurFade delay={0.16}>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
              <time dateTime={blog.date}>{formatDate(blog.date)}</time>
              {blog.updatedAt && blog.updatedAt !== blog.date && (
                <>
                  <span>·</span>
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-sm px-1.5 py-0 text-[10px] font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            </BlurFade>

            {/* Mobile actions row */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <button
                type="button"
                onClick={handleReadAloud}
                aria-label={isReading ? "Stop reading" : "Read article aloud"}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                  isReading
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {isReading ? <StopIcon /> : <ReadAloudIcon />}
                {isReading ? "Stop" : "Listen"}
              </button>
              <button
                type="button"
                onClick={() => handleShare("whatsapp")}
                aria-label="Share on WhatsApp"
                className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
              >
                <WhatsAppIcon />
              </button>
              <button
                type="button"
                onClick={() => handleShare("linkedin")}
                aria-label="Share on LinkedIn"
                className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
              >
                <LinkedInIcon />
              </button>
              <button
                type="button"
                onClick={() => handleShare("twitter")}
                aria-label="Share on Twitter / X"
                className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
              >
                <TwitterIcon />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border mb-8" />

            {/* Content */}
            <BlurFade delay={0.24}>
            <div>
              {(blog.content as ContentBlock[]).map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      data-heading={block.text}
                      className="mt-10 mb-3 scroll-mt-16 text-lg font-bold tracking-tight font-mono"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul
                      key={index}
                      className="mb-4 ml-4 space-y-1.5 list-disc marker:text-muted-foreground"
                    >
                      {block.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm leading-7 text-foreground/90 font-comic"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p
                    key={index}
                    className="mb-4 text-sm leading-7 text-foreground/90 font-comic"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>
            </BlurFade>

            {/* Footer divider + back */}
            <div className="h-px w-full bg-border mt-12 mb-8" />
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
              <ChevronRight className="size-3.5" />
              <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
              <ChevronRight className="size-3.5" />
              <span className="truncate text-foreground font-medium">{blog.title}</span>
            </nav>
          </article>

          {/* ── Right Sidebar: Next Blog + Actions ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-12 space-y-6">
              {/* Next blog card */}
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Next Post
                </span>
                <Link
                  href={`/blog/${nextBlog.id}`}
                  className="group block rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <h4 className="text-xs font-medium leading-snug group-hover:underline line-clamp-3">
                    {nextBlog.title}
                  </h4>
                  <span className="mt-1.5 block text-[10px] text-muted-foreground">
                    {formatDate(nextBlog.date)}
                  </span>
                </Link>
              </div>

              {/* Read aloud */}
              <div>
                <button
                  type="button"
                  onClick={handleReadAloud}
                  aria-label={isReading ? "Stop reading" : "Read article aloud"}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    isReading
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  }`}
                >
                  {isReading ? <StopIcon /> : <ReadAloudIcon />}
                  {isReading ? "Stop" : "Listen"}
                </button>
              </div>

              {/* Share */}
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Share
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare("whatsapp")}
                    aria-label="Share on WhatsApp"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <WhatsAppIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("linkedin")}
                    aria-label="Share on LinkedIn"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <LinkedInIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on Twitter / X"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <TwitterIcon />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
