import type { Metadata } from "next";
import templates from "@/data/templateData";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = {
  title: "Templates - Gyanranjan Priyam",
  description:
    "Browse my collection of free pre-built website templates featuring modern designs, smooth animations, and responsive layouts. Built with React, Next.js, and Tailwind CSS. Ready to customize and deploy.",
  keywords: [
    "website templates",
    "free website templates",
    "free Next.js templates",
    "free React templates",
    "free Tailwind CSS templates",
    "free landing page templates",
    "free dashboard templates",
    "free portfolio templates",

    "Next.js templates ",
    "React templates",
    "Tailwind CSS templates",
    "TypeScript templates",
    "shadcn ui templates",
    "Next.js starter templates",
    "React starter kit",

    "modern web design templates",
    "responsive website templates",
    "animated website templates",
    "minimalist website templates",
    "dark mode website templates",
    "UI component templates",

    "landing page template Next.js",
    "portfolio website template",
    "AI landing page template",
    "SaaS landing page template",
    "blog template Next.js",
    "admin dashboard template",
    "developer portfolio template",

    "Gyanranjan Priyam templates",
    "Gyanranjan Priyam designs",
    "Priyam web templates",

    "open source website templates",
    "developer templates India",
    "web design templates download",
    "ready to deploy templates",
    "customizable web templates",
  ],
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Templates — Gyanranjan Priyam",
    description:
      "Browse my collection of free pre-built website templates featuring modern designs, smooth animations, and responsive layouts. Built with React, Next.js, and Tailwind CSS.",
    url: `${SITE_URL}/templates`,
    siteName: "Gyanranjan Priyam",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates — Gyanranjan Priyam",
    description:
      "Browse my collection of free pre-built website templates featuring modern designs, smooth animations, and responsive layouts. Built with React, Next.js, and Tailwind CSS.",
    creator: "@gyanranjanpriyam", // ← your Twitter handle
  },
};

export default function TemplatesPage() {
  return <TemplatesClient templates={templates} />;
}
