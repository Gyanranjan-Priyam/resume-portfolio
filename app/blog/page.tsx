import type { Metadata } from "next";
import BlogPageClient from "./blog-client";

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
  alternates: { canonical: "/blog" },
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

export default function BlogPage() {
  return <BlogPageClient />;
}