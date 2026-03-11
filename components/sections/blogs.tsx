import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import blogs from "@/data/blogsData";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogsSection() {
  return (
    <section id="blogs" className="py-8">
      <BlurFade delay={0.04} inView>
      <h2 className="mb-6 text-3xl font-bold">Blog</h2>
      </BlurFade>
      <div className="space-y-4">
        {blogs.slice(0, 3).map((blog, i) => (
          <BlurFade key={blog.id} delay={0.04 + i * 0.05} inView>
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold group-hover:underline">
                {blog.title}
              </h3>
              <span className="shrink-0 text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(blog.date)}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {blog.excerpt}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-sm px-1.5 py-0.5 text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
          </BlurFade>
        ))}
      </div>
      <BlurFade delay={0.25} inView>
      <Link
        href="/blog"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        View All <ArrowRight className="size-3.5" />
      </Link>
      </BlurFade>
    </section>
  );
}
