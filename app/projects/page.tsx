import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import projects from "@/data/projectsData";
import { BlurFade } from "@/components/ui/blur-fade";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <BlurFade delay={0.04}>
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1
                className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Projects
              </h1>
              <p
                className="text-muted-foreground font-medium tracking-tight"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Things I&apos;ve built — from full-stack platforms to community
                tools.
              </p>
            </div>
            <Link
              href="/"
              aria-label="Home"
              className="shrink-0 ml-4 mt-1 rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="size-4" />
            </Link>
          </div>
        </BlurFade>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <BlurFade key={project.id} delay={0.12 + i * 0.05} inView>
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className="text-md font-semibold group-hover:underline"
                      style={{ fontFamily: "var(--font-ibm)" }}
                    >
                      {project.title}
                    </h2>
                    <span
                      className="shrink-0 text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {project.date}
                    </span>
                  </div>
                  <p
                    className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2 tracking-tight"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {project.desc[0]}
                  </p>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
}
