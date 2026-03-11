import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import projects from "@/data/projectsData";

export const metadata: Metadata = {
  title: "Projects — Gyanranjan Priyam",
  description:
    "A collection of projects I've built — from full-stack platforms to open-source tools.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>

        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mb-10 text-muted-foreground">
          Things I&apos;ve built — from full-stack platforms to community tools.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
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
                  <h2 className="text-sm font-semibold group-hover:underline">
                    {project.title}
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {project.date}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {project.desc[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
