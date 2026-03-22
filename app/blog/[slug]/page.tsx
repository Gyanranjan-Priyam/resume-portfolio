import type { Metadata } from "next";
import { notFound } from "next/navigation";
import blogs from "@/data/blogsData";
import { BlogPostClient } from "@/components/sections/blog-post-client";

const SITE_URL = "https://www.gyanranjanpriyam.tech";

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

  const ogImageUrl = `${SITE_URL}/blog/${blog.id}/opengraph-image`;

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
      description: blog.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blogIndex = blogs.findIndex((b) => b.id === slug);

  if (blogIndex === -1) notFound();

  const blog = blogs[blogIndex];
  const nextBlog = blogs[(blogIndex + 1) % blogs.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.date,
    dateModified: blog.updatedAt ?? blog.date,
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
      "@id": `${SITE_URL}/blog/${blog.id}`,
    },
    keywords: blog.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient
        blog={blog}
        nextBlog={{
          id: nextBlog.id,
          title: nextBlog.title,
          date: nextBlog.date,
        }}
      />
    </>
  );
}