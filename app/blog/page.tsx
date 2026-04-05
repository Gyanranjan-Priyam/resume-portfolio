import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BlogPageClient, { type BlogListItem } from "./blog-client";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs - Gyanranjan Priyam",
  description:
    "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  keywords: [
    "Gyanranjan Priyam",
    "Priyam Blog",
    "Gyanranjan Priyam Blog",
    "Gyanranjan Priyam articles",
    "Gyanranjan developer blog",
    "React blog",
    "Next.js blog",
    "Next.js tutorials",
    "React tutorials",
    "TypeScript tutorials",
    "JavaScript tips",
    "Node.js articles",
    "frontend development blog",
    "web development blog",
    "web development articles",
    "modern frontend techniques",
    "UI development tips",
    "CSS tips and tricks",
    "Tailwind CSS tutorials",
    "responsive design tips",
    "web performance optimization",
    "React performance tips",
    "Next.js performance",
    "Core Web Vitals",
    "SEO for developers",
    "accessibility best practices",
    "full stack development",
    "software engineering blog",
    "programming tutorials",
    "developer blog India",
    "Indian developer blog",
    "coding tips and tricks",
    "open source projects",
    "tech blog 2025",
  ],
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
  openGraph: {
    title: "Blogs — Gyanranjan Priyam",
    description:
      "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  },
  twitter: {
    title: "Blogs — Gyanranjan Priyam",
    description:
      "Read articles and insights on web development, React, Next.js, performance optimization, and modern frontend techniques by Gyanranjan Priyam.",
  },
};

async function getBlogs(): Promise<BlogListItem[]> {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      tags: true,
      createdAt: true,
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

  return blogs.map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    shortDescription: blog.shortDescription,
    tags: blog.tags,
    createdAt: blog.createdAt.toISOString(),
    user: blog.user
      ? {
          id: blog.user.id,
          name: blog.user.name,
          username: blog.user.username,
          image: blog.user.image,
        }
      : undefined,
  }));
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  return <BlogPageClient blogs={blogs} />;
}
