import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: {
      slug: true,
      title: true,
      shortDescription: true,
      tags: true,
      createdAt: true,
      components: {
        where: { type: "richtext" },
        orderBy: { order: "asc" },
        select: { text: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20, // latest 20 only to avoid huge response
  });

  const content = `# Gyanranjan Priyam — Full Blog Content

${blogs
  .map((blog: { components: any[]; title: any; slug: any; tags: any[]; createdAt: { toISOString: () => string; }; shortDescription: any; }) => {
    const bodyText = blog.components
      .map((c: { text: any; }) => c.text ?? "")
      .filter(Boolean)
      .join("\n\n");

    return `---

## ${blog.title}

URL: ${SITE_URL}/blog/${blog.slug}
Tags: ${blog.tags.join(", ")}
Published: ${blog.createdAt.toISOString().split("T")[0]}

${blog.shortDescription}

${bodyText}`;
  })
  .join("\n\n")}
`.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}