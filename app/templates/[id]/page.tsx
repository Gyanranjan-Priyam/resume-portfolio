/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ExternalLink, Github, Zap } from "lucide-react";
import templates from "@/data/templateData";
import { SITE_URL } from "@/lib/config";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";
import { TemplatePreview } from "./TemplatePreview";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);
  if (!template) return {};

  const ogImageUrl = `${SITE_URL}/templates/${template.id}/opengraph-image`;

  return {
    title: `${template.title} Template`,
    description: `Check out the ${template.title} template — ${template.desc[0]}`,
    keywords: [
      `${template.title} template`,
      `${template.title} design`,
      `${template.category} template`,
      `Free ${template.title}`,
      ...template.tech,
    ],
    alternates: { canonical: `/templates/${template.id}` },
    openGraph: {
      title: `${template.title} — Gyanranjan Priyam`,
      description: template.desc[0],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: template.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.title} — Gyanranjan Priyam`,
      description: template.desc[0],
      images: [ogImageUrl],
    },
  };
}

export default async function TemplatePage({ params }: Props) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);
  if (!template) notFound();

  const templateSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: template.title,
    description: template.desc[0],
    url: template.liveLink || `${SITE_URL}${template.link}`,
    image: template.img,
    dateCreated: template.date,
    creator: {
      "@type": "Person",
      name: "Gyanranjan Priyam",
      url: SITE_URL,
    },
    ...(template.github && { codeRepository: template.github }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(templateSchema) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <BlurFade delay={0.04}>
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/templates"
              className="transition-colors hover:text-foreground"
            >
              Templates
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="truncate text-foreground font-medium">
              {template.title}
            </span>
          </nav>
        </BlurFade>

        {/* Header */}
        <BlurFade delay={0.12}>
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "var(--font-ibm)" }}
                >
                  {template.title}
                </h1>
                <p
                  className="mt-1 text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-ibm)" }}
                >
                  {template.company} &middot; {template.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {template.liveLink && (
                  <a
                    href={template.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    <ExternalLink className="size-3.5" />
                    Live Demo
                  </a>
                )}
                {template.github && (
                  <a
                    href={template.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    <Github className="size-4" />
                    Source
                  </a>
                )}
              </div>
            </div>

            {/* Tech badges */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {template.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Preview Section with Desktop/Mobile Toggle */}
        {(template.desktopImage || template.mobileImage || template.liveLink) && (
          <BlurFade delay={0.15}>
            <div className="mb-8">
              <TemplatePreview
                title={template.title}
                liveLink={template.liveLink}
                desktopImage={template.desktopImage}
                mobileImage={template.mobileImage}
              />
            </div>
          </BlurFade>
        )}

        {/* Fallback Image if no preview available */}
        {!template.desktopImage && !template.mobileImage && !template.liveLink && template.img && (
          <BlurFade delay={0.15}>
            <div className="relative w-full aspect-video mb-8 overflow-hidden rounded-lg">
              <Image
                src={template.img}
                alt={template.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </BlurFade>
        )}

        {/* Description */}
        <BlurFade delay={0.16}>
          <div className="mb-10 space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-ibm)" }}
            >
              Overview
            </h2>
            {template.desc.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm font-medium leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </BlurFade>

        {/* Key Highlights */}
        {"highlights" in template && (template as any).highlights?.length > 0 && (
          <BlurFade delay={0.18} inView>
            <div className="mb-10">
              <h2
                className="mb-4 text-2xl font-semibold"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Key Highlights
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(template as any).highlights.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border p-3 tracking-tight font-medium"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    <Zap className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Features */}
        {"features" in template && (template as any).features?.length > 0 && (
          <BlurFade delay={0.20} inView>
            <div className="mb-10">
              <h2
                className="mb-4 text-2xl font-semibold"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Features Included
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {(template as any).features.map((feature: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="mt-0.5 size-1.5 rounded-full bg-foreground shrink-0" />
                    <p
                      className="text-sm leading-relaxed text-muted-foreground font-medium"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Tech Stack Section */}
        <BlurFade delay={0.22} inView>
          <div className="mb-10">
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ fontFamily: "var(--font-ibm)" }}
            >
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {template.tech.map((tech) => (
                <div
                  key={tech}
                  className="rounded-lg border bg-muted/30 px-4 py-2 text-sm font-medium"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* CTA Section */}
        <BlurFade delay={0.24} inView>
          <div className="rounded-lg border bg-muted/30 p-6 text-center">
            <h3
              className="mb-2 text-xl font-semibold"
              style={{ fontFamily: "var(--font-ibm)" }}
            >
              Ready to use this template?
            </h3>
            <p
              className="mb-4 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              View the live demo or check out the source code
            </p>
            <div className="flex items-center justify-center gap-3">
              {template.liveLink && (
                <a
                  href={template.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  <ExternalLink className="size-4" />
                  View Live Demo
                </a>
              )}
              {template.github && (
                <a
                  href={template.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  <Github className="size-4" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </BlurFade>

        {/* Back to Templates */}
        <BlurFade delay={0.26} inView>
          <div className="mt-12 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              <ChevronRight className="size-3.5 rotate-180" />
              Back to all templates
            </Link>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
