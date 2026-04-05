import type { Metadata } from "next";
import projects from "@/data/projectsData";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects - Gyanranjan Priyam",
  description:
    "Explore my portfolio to see a range of full stack projects, from responsive websites to web applications. Discover my work with React, Next.js, Node.js, and more.",
  keywords: [
    "Gyanranjan Priyam projects",
    "Gyanranjan Priyam portfolio",
    "Priyam Projects",
    "Gyanranjan developer portfolio",
    "Gyanranjan Priyam work",
    "portfolio showcase",
    "web development portfolio",
    "frontend developer portfolio",
    "full stack developer portfolio",
    "developer portfolio India",
    "Indian developer portfolio",
    "software engineer portfolio",
    "React projects",
    "Next.js projects",
    "Next.js portfolio",
    "TypeScript projects",
    "Node.js projects",
    "JavaScript projects",
    "Tailwind CSS projects",
    "Prisma projects",
    "REST API projects",
    "full stack projects",
    "web application projects",
    "responsive web projects",
    "web design portfolio",
    "frontend development examples",
    "SaaS projects",
    "open source projects GitHub",
    "real world React projects",
    "real world Next.js projects",
    "hire React developer India",
    "hire Next.js developer",
    "freelance web developer portfolio",
    "professional web development",
    "web developer projects 2025",
    "coding projects showcase",
    "GitHub projects portfolio",
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
