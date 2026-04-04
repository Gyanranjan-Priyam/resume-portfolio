import type { Metadata } from "next";
import templates from "@/data/templateData";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse my collection of pre-built website templates featuring modern designs, smooth animations, and responsive layouts. Ready to customize and deploy.",
  keywords: [
    "Website Templates",
    "React Templates",
    "Next.js Templates",
    "Landing Page Templates",
    "Dashboard Templates",
    "Portfolio Templates",
    "Free Website Templates",
    "Modern Web Design",
    "Tailwind CSS Templates",
    "Responsive Templates",
  ],
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Templates — Gyanranjan Priyam",
    description:
      "Browse my collection of pre-built website templates featuring modern designs and smooth animations.",
  },
  twitter: {
    title: "Templates — Gyanranjan Priyam",
    description:
      "Browse my collection of pre-built website templates featuring modern designs and smooth animations.",
  },
};

export default function TemplatesPage() {
  return <TemplatesClient templates={templates} />;
}