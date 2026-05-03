import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/config";
import projects from "@/data/projectsData";
import templates from "@/data/templateData";

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
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const formatDescription = (descriptionParts: string[]) => descriptionParts.join(" ");

  const content = `# Gyanranjan Priyam

> Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.

- Website: ${SITE_URL}
- GitHub: https://github.com/gyanranjan-priyam
- LinkedIn: https://linkedin.com/in/gyanranjan-priyam
- Twitter: https://twitter.com/gr_priyam

## Blog

Technical articles on web development, React, Next.js, TypeScript, and AI/ML.

${blogs
  .map(
    (blog: { title: any; slug: any; shortDescription: any; tags: any[]; }) =>
      `- [${blog.title}](${SITE_URL}/blog/${blog.slug}): ${blog.shortDescription} [${blog.tags.join(", ")}]`
  )
  .join("\n")}

## Projects

${projects
  .map(
    (p) =>
      `- [${p.title}](${SITE_URL}/projects/${p.id}): ${formatDescription(p.desc)}`
  )
  .join("\n")}

## Templates

${templates
  .map(
    (t) =>
      `- [${t.title}](${SITE_URL}/templates/${t.id}): ${formatDescription(t.desc)}`
  )
  .join("\n")}

## Pages

- [Home](${SITE_URL}): Portfolio homepage
- [Blog](${SITE_URL}/blog): All blog posts
- [Projects](${SITE_URL}/projects): Showcase of projects
- [Templates](${SITE_URL}/templates): Free developer templates
`.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}