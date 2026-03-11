import type { Metadata } from "next";
import { notFound } from "next/navigation";
import blogs from "@/data/blogsData";
import { BlogPostClient } from "@/components/sections/blog-post-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.id === slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.tags,
    alternates: { canonical: `/blog/${blog.id}` },
    openGraph: {
      title: `${blog.title} — Gyanranjan Priyam`,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.date,
      modifiedTime: blog.updatedAt,
      authors: ["Gyanranjan Priyam"],
      tags: blog.tags,
    },
    twitter: {
      title: `${blog.title} — Gyanranjan Priyam`,
      description: blog.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blogIndex = blogs.findIndex((b) => b.id === slug);

  if (blogIndex === -1) notFound();

  const blog = blogs[blogIndex];
  const nextBlog = blogs[(blogIndex + 1) % blogs.length];

  return (
    <BlogPostClient
      blog={blog}
      nextBlog={{ id: nextBlog.id, title: nextBlog.title, date: nextBlog.date }}
    />
  );
}
