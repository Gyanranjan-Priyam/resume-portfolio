import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822Date(date: Date): string {
  return date.toUTCString();
}

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: {
      slug: true,
      title: true,
      shortDescription: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const latestDate = blogs[0]?.createdAt ?? new Date();

  const items = blogs
    .map(
      (blog) => `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <description>${escapeXml(blog.shortDescription)}</description>
      <pubDate>${toRFC822Date(blog.createdAt)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog — Gyanranjan Priyam</title>
    <link>${SITE_URL}/blog</link>
    <description>Thoughts on web development, engineering, and the journey of building things by Gyanranjan Priyam.</description>
    <language>en-us</language>
    <lastBuildDate>${toRFC822Date(latestDate)}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
