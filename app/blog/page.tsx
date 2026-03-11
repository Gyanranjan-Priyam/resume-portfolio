import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import blogs from "@/data/blogsData";

export const metadata: Metadata = {
  title: "Blog — Gyanranjan Priyam",
  description: "Thoughts on web development, engineering, and the journey of building things.",
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
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">
          Thoughts on web development, engineering, and the journey of building things.
        </p>

        <div className="space-y-4">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-sm font-semibold group-hover:underline">
                  {blog.title}
                </h2>
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(blog.date)}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
