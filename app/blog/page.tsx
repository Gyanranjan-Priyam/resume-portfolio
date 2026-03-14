import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import blogs from "@/data/blogsData";
import { BlurFade } from "@/components/ui/blur-fade";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  keywords: [
    "Priyam Blog",
    "Web Development Blog",
    "React Articles",
    "Next.js Tutorials",
    "Frontend Development",
    "JavaScript Tips",
    "Gyanranjan Priyam Blog",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Gyanranjan Priyam",
    description:
      "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  },
  twitter: {
    title: "Blog — Gyanranjan Priyam",
    description:
      "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <BlurFade delay={0.04}>
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Blog
              </h1>
              <p
                className="text-muted-foreground font-medium tracking-tight"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Thoughts on web development, engineering, and the journey of
                building things.
              </p>
            </div>
            <Link
              href="/"
              aria-label="Home"
              className="shrink-0 ml-4 mt-1 rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="size-4" />
            </Link>
          </div>
        </BlurFade>

        <div className="space-y-4">
          {blogs.map((blog, i) => (
            <BlurFade key={blog.id} delay={0.12 + i * 0.05} inView>
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2
                    className="text-md font-semibold group-hover:underline tracking-tight"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    {blog.title}
                  </h2>
                  <span
                    className="shrink-0 text-sm text-muted-foreground whitespace-nowrap"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {formatDate(blog.date)}
                  </span>
                </div>
                <p
                  className="mt-1.5 text-sm leading-relaxed font-medium text-muted-foreground line-clamp-2 tracking-tight"
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
    </div>
  );
}
