import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/config";
import { BlogPostClient, type Blog, type NextBlog } from "@/components/sections/blog-post-client";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
    include: {
      components: {
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  return blog;
}

async function getNextBlogs(currentBlogId: string, currentBlogCreatedAt: Date) {
  // Get the next 2 blogs (older than current)
  const nextBlogs = await prisma.blog.findMany({
    where: {
      published: true,
      createdAt: { lt: currentBlogCreatedAt },
    },
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { id: true, slug: true, title: true, createdAt: true },
  });

  // If we have less than 2, wrap around to get more from the newest
  if (nextBlogs.length < 2) {
    const needed = 2 - nextBlogs.length;
    const existingIds = [currentBlogId, ...nextBlogs.map((b) => b.id)];
    const moreBlogs = await prisma.blog.findMany({
      where: {
        published: true,
        id: { notIn: existingIds },
      },
      orderBy: { createdAt: "desc" },
      take: needed,
      select: { id: true, slug: true, title: true, createdAt: true },
    });
    nextBlogs.push(...moreBlogs);
  }

  return nextBlogs;
}

// Force dynamic rendering - no static generation caching
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  const ogImageUrl = `${SITE_URL}/blog/${blog.slug}/opengraph-image`;

  return {
    title: blog.title,
    description: blog.shortDescription,
    keywords: blog.tags,
    alternates: { canonical: `/blog/${blog.slug}` },
    openGraph: {
      title: `${blog.title} — Gyanranjan Priyam`,
      description: blog.shortDescription,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      authors: ["Gyanranjan Priyam"],
      tags: blog.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} — Gyanranjan Priyam`,
      description: blog.shortDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const nextBlogsData = await getNextBlogs(blog.id, blog.createdAt);

  // Transform dates to strings for client component
  const blogForClient: Blog = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    shortDescription: blog.shortDescription,
    thumbnailKey: blog.thumbnailKey,
    tags: blog.tags,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    components: blog.components.map((comp) => ({
      id: comp.id,
      type: comp.type as "richtext" | "imagetext" | "imageuploader" | "videoplayer" | "code",
      order: comp.order,
      content: comp.content ?? undefined,
      text: comp.text,
      imageKey: comp.imageKey,
      alignment: comp.alignment,
      videoUrl: comp.videoUrl,
      videoType: comp.videoType,
    })),
    user: blog.user
      ? {
          id: blog.user.id,
          name: blog.user.name,
          username: blog.user.username,
          image: blog.user.image,
        }
      : undefined,
  };

  // Map next blogs to client format
  const nextBlogs: NextBlog[] = nextBlogsData.map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    createdAt: b.createdAt.toISOString(),
  }));

  // If no blogs found, use current blog as fallback
  if (nextBlogs.length === 0) {
    nextBlogs.push({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      createdAt: blog.createdAt.toISOString(),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.shortDescription,
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Gyanranjan Priyam",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Gyanranjan Priyam",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`,
    },
    keywords: blog.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient blog={blogForClient} nextBlogs={nextBlogs} />
    </>
  );
}