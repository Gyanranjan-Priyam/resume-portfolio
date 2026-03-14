"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltipProvider";
import { Highlighter } from "../ui/highlighter";
import { BlurFade } from "@/components/ui/blur-fade";

const socials: { label: string; href: string; icon: ReactNode; download?: boolean; tooltipProvider: string }[] = [
  {
    label: "GitHub",
    href: "https://github.com/gyanranjan-priyam",
    icon: (
      <svg viewBox="0 0 438.549 438.549" className="size-5">
        <path fill="currentColor" d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
      </svg>
    ),
    tooltipProvider: "View my GitHub profile"
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/gyanranjan-priyam",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    tooltipProvider: "View my LinkedIn profile"
  },
  {
    label: "Twitter",
    href: "https://x.com/gr_priyam",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    tooltipProvider: "View my Twitter profile"
  },
  {
    label: "Email",
    href: "mailto:info@priyam.tech",
    icon: (
      <svg viewBox="0 0 256 193" className="size-5">
        <path fill="#4285F4" d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z" />
        <path fill="#34A853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798z" />
        <path fill="#EA4335" d="M58.182 93.14l-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z" />
        <path fill="#FBBC04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z" />
        <path fill="#C5221F" d="M0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z" />
      </svg>
    ),
      tooltipProvider: "Send me an email"
  },
  {
    label: "Instagram",
    href: "https://instagram.com/gyanranjanpriyam",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path fill="#E4405F" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
      tooltipProvider: "View my Instagram profile"
  },
];

export function HeroSection() {
  const [, setIsDark] = useState(
    () => typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [waving, setWaving] = useState(true);

  // Restart wave animation every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setWaving(false);
      requestAnimationFrame(() => setWaving(true));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.style.transition = "background-color 0.5s ease, color 0.5s ease";
    html.classList.toggle("dark");
    setIsDark(html.classList.contains("dark"));
    setTimeout(() => {
      html.style.transition = "";
    }, 500);
  }, []);

  return (
    <section className="pb-8 pt-6">
      {/* Cover image */}
      <BlurFade delay={0.04} direction="down">
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-linear-to-br from-neutral-200 via-neutral-300 to-neutral-400 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-900 sm:h-40">
        <Image
          src="/profile/cover.png"
          alt="Cover"
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      </BlurFade>

      {/* Avatar row */}
      <BlurFade delay={0.1} direction="up">
      <div className="flex items-end px-2 -mt-16 sm:-mt-20">
        <Avatar className="size-32 border-4 border-background shadow-md ring-1 ring-border sm:size-36">
          <AvatarImage src="/profile/profile.png" alt="Gyanranjan Priyam" />
          <AvatarFallback className="text-3xl font-semibold">GP</AvatarFallback>
        </Avatar>
      </div>
      </BlurFade>

      {/* Info */}
      <div className="mt-3 space-y-1.5 px-1">
        <BlurFade delay={0.16} direction="up">
        <h1 className="text-2xl font-bold tracking-widest sm:text-4xl" style={{ fontFamily: "var(--font-mokoto)" }}>
          Hi I&apos;m  {" "}
            <span className="cursor-pointer" ><Highlighter action="underline" color="#FF9800">Priyam</Highlighter> </span>
          {" "}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-block origin-[70%_80%] cursor-pointer align-middle text-2xl leading-none sm:text-3xl"
            style={{ animation: waving ? "wave 1.8s ease-in-out infinite" : "none" }}
          >
            👋
          </button>
        </h1>
        </BlurFade>
        <BlurFade delay={0.22} direction="up">
        <p className="text-lg mt-3 font-medium text-muted-foreground">
          Full-Stack Developer · Electrical Engineering @GCE Kalahandi
        </p>
        </BlurFade>
        <BlurFade delay={0.28} direction="up">
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Electrical Engineer by degree, Full-Stack Developer by passion. I
          build scalable products and mentor the next generation of developers.
        </p>
        </BlurFade>

        {/* Social icons + Resume button */}
        <BlurFade delay={0.34} direction="up">
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <TooltipProvider>
            {socials.map((s) => (
              <Tooltip key={s.label}>
                <TooltipTrigger asChild>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    aria-label={s.label}
                    className="text-muted-foreground transition-opacity hover:opacity-70"
                  >
                    {s.icon}
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  {s.tooltipProvider}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          <a
            href="/resume/resume.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Resume
          </a>
        </div>
        </BlurFade>
      </div>
    </section>
  );
}
