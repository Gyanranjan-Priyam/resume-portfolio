import blogs from "@/data/blogsData";

const SITE_URL = "https://www.gyanranjanpriyam.tech";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822Date(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET() {
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestDate = sortedBlogs[0]?.date ?? new Date().toISOString();

  const items = sortedBlogs
    .map(
      (blog) => `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${SITE_URL}/blog/${blog.id}</link>
      <description>${escapeXml(blog.excerpt)}</description>
      <pubDate>${toRFC822Date(blog.date)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.id}</guid>
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
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
