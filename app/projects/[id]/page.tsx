import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ExternalLink, Github, Users, Zap, Layers } from "lucide-react";
import projects from "@/data/projectsData";
import { BlurFade } from "@/components/ui/blur-fade";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { FolderStructure } from "@/components/ui/folder-structure";
import { FeaturesAccordion } from "@/components/ui/features-accordion";

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

  const mediaItems = project.images;
  const hasRichContent = 'highlights' in project || 'features' in project || 'techDetailed' in project;

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

        {/* Header */}
        <BlurFade delay={0.12}>
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
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
                    <Github className="size-4" />
                    Source
                  </a>
                )}
              </div>
            </div>

            {/* Tech badges */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Role */}
        {'role' in project && project.role && (
          <BlurFade delay={0.14}>
            <div className="mb-8 flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">My Role: </span>
                {project.role}
              </p>
            </div>
          </BlurFade>
        )}

        {/* Description */}
        <BlurFade delay={0.16}>
          <div className="mb-10 space-y-4">
            <h2 className="text-lg font-semibold">Overview</h2>
            {project.desc.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </BlurFade>

        {/* Key Highlights */}
        {'highlights' in project && (project as any).highlights?.length > 0 && (
          <BlurFade delay={0.18} inView>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold">Key Highlights</h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(project as any).highlights.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg border p-3">
                    <Zap className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Features by category */}
        {'features' in project && (project as any).features?.length > 0 && (
          <BlurFade delay={0.2} inView>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold">Features</h2>
              <FeaturesAccordion features={(project as any).features} />
            </div>
          </BlurFade>
        )}

        {/* Tech stack table */}
        {'techDetailed' in project && (project as any).techDetailed?.length > 0 && (
          <BlurFade delay={0.22} inView>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold">Tech Stack</h2>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-2.5 text-left font-semibold">Layer</th>
                      <th className="px-4 py-2.5 text-left font-semibold">Technology</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(project as any).techDetailed.map((row: { layer: string; value: string }, i: number) => (
                      <tr key={i} className="transition-colors hover:bg-muted/20">
                        <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">{row.layer}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </BlurFade>
        )}

        {/* Folder Structure */}
        {'folderStructure' in project && (project as any).folderStructure?.length > 0 && (
          <BlurFade delay={hasRichContent ? 0.23 : 0.19} inView>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold">Project Structure</h2>
              <FolderStructure structure={(project as any).folderStructure} />
            </div>
          </BlurFade>
        )}

        {/* Gallery */}
        {mediaItems.length > 0 && (
          <BlurFade delay={hasRichContent ? 0.24 : 0.2} inView>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold">Screenshots</h2>
              <ImageCarousel images={mediaItems} title={project.title} />
            </div>
          </BlurFade>
        )}

        {/* Next project */}
        <BlurFade delay={hasRichContent ? 0.28 : 0.24} inView>
          <div className="border-t pt-8">
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
