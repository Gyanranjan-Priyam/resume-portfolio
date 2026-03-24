import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostClient, type Blog, type NextBlog } from "@/components/sections/blog-post-client";

const SITE_URL = "https://www.gyanranjanpriyam.tech";

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

async function getNextBlog(currentBlogId: string, currentBlogCreatedAt: Date) {
  // Get the next blog (older than current) or wrap to newest if at the end
  let nextBlog = await prisma.blog.findFirst({
    where: {
      published: true,
      createdAt: { lt: currentBlogCreatedAt },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, createdAt: true },
  });

  // If no older blog, get the newest one (wrap around)
  if (!nextBlog) {
    nextBlog = await prisma.blog.findFirst({
      where: {
        published: true,
        id: { not: currentBlogId },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, title: true, createdAt: true },
    });
  }

  return nextBlog;
}

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

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

  const nextBlogData = await getNextBlog(blog.id, blog.createdAt);

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
      type: comp.type as "richtext" | "imagetext" | "imageuploader" | "videoplayer",
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

  // Use the current blog as next if no other blog exists
  const nextBlog: NextBlog = nextBlogData
    ? {
        id: nextBlogData.id,
        slug: nextBlogData.slug,
        title: nextBlogData.title,
        createdAt: nextBlogData.createdAt.toISOString(),
      }
    : {
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        createdAt: blog.createdAt.toISOString(),
      };

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
      <BlogPostClient blog={blogForClient} nextBlog={nextBlog} />
    </>
  );
}