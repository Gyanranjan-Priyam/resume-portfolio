import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BlogPageClient, { type BlogListItem } from "./blog-client";

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
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
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