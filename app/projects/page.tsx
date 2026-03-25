import type { Metadata } from "next";
import projects from "@/data/projectsData";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio to see a range of full stack projects, from responsive websites to web applications. Discover my work with React, Next.js, Node.js, and more.",
  keywords: [
    "Priyam Projects",
    "Portfolio Showcase",
    "Frontend Development Examples",
    "Web Design Portfolio",
    "Responsive Web Projects",
    "Web Applications Portfolio",
    "JavaScript Development",
    "React Work",
    "Next.js Projects",
    "Professional Web Development",
    "Gyanranjan Priyam Projects",
  ],
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Gyanranjan Priyam",
    description:
      "Explore my portfolio to see a range of full stack projects, from responsive websites to web applications.",
  },
  twitter: {
    title: "Projects — Gyanranjan Priyam",
    description:
      "Explore my portfolio to see a range of full stack projects, from responsive websites to web applications.",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient projects={projects} />;
}
