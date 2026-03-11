import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import projects from "@/data/projectsData";
import { BlurFade } from "@/components/ui/blur-fade";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} Project`,
    description: `Check out my work on the ${project.title} project, collaborating with ${project.company}, where I enhanced full stack development with responsive design and optimized user interactions.`,
    keywords: [
      `${project.title} project`,
      `${project.title} development`,
      `${project.company} collaboration`,
      `Priyam ${project.title}`,
      `Full Stack development ${project.title}`,
    ],
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title: `${project.title} — Gyanranjan Priyam`,
      description: project.desc[0],
      images: [{ url: project.img, alt: project.title }],
    },
    twitter: {
      title: `${project.title} — Gyanranjan Priyam`,
      description: project.desc[0],
      images: [project.img],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const SITE_URL = "https://www.gyanranjanpriyam.tech";
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.desc[0],
    url: project.liveLink || `${SITE_URL}${project.link}`,
    image: project.img,
    dateCreated: project.date,
    creator: {
      "@type": "Person",
      name: "Gyanranjan Priyam",
      url: SITE_URL,
    },
    ...(project.github && { codeRepository: project.github }),
  };

  const mediaItems = project.images.filter(
    (img) => img.tag !== "video"
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <BlurFade delay={0.04}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/projects" className="transition-colors hover:text-foreground">Projects</Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate text-foreground font-medium">{project.title}</span>
        </nav>
        </BlurFade>

        {/* Hero image */}
        <BlurFade delay={0.08}>
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border bg-muted">
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
        </BlurFade>

        {/* Header */}
        <BlurFade delay={0.12}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {project.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.company} &middot; {project.date}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ExternalLink className="size-3.5" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source
              </a>
            )}
          </div>
        </div>
        </BlurFade>

        {/* Description */}
        <BlurFade delay={0.16}>
        <div className="mb-10 space-y-4">
          {project.desc.map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
        </BlurFade>

        {/* Gallery */}
        {mediaItems.length > 0 && (
          <BlurFade delay={0.2} inView>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Screenshots</h2>
            <div className="grid grid-cols-2 gap-4">
              {mediaItems.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-lg border bg-muted ${
                    img.tag === "small"
                      ? "aspect-[9/16] col-span-1"
                      : "aspect-video col-span-2"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className={img.tag === "small" ? "object-contain" : "object-cover"}
                    sizes={
                      img.tag === "small"
                        ? "(max-width: 768px) 50vw, 384px"
                        : "(max-width: 768px) 100vw, 768px"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          </BlurFade>
        )}

        {/* Next project */}
        <BlurFade delay={0.24} inView>
        <div className="mt-12 border-t pt-8">
          {(() => {
            const idx = projects.findIndex((p) => p.id === project.id);
            const next = projects[(idx + 1) % projects.length];
            return (
              <Link
                href={`/projects/${next.id}`}
                className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Next Project</p>
                  <p className="text-sm font-semibold group-hover:underline">
                    {next.title}
                  </p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            );
          })()}
        </div>
        </BlurFade>
      </div>
    </div>
  );
}
