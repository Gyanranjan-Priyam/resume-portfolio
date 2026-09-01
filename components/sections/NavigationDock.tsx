"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useLoaderStore } from "@/components/loader-component";
import {
  ExpandableTabs,
  type ExpandableTabsItem,
  useExpandableTabs,
} from "@/components/motion/expandable-tabs";
import {
  IconHome,
  IconBriefcase,
  IconNotebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconMail,
  IconCompass,
  IconDownload,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconSparkles,
  IconMoon,
  IconSun,
  IconArrowUp,
  IconShare,
  IconCode,
  IconStack2,
  IconFolderCode,
  IconTemplate,
} from "@tabler/icons-react";
import projects from "@/data/projectsData";
import templates from "@/data/templateData";

const EMAIL_ADDRESS = "info@priyam.tech";

/* -------------------------------------------------------------------------- */
/* 1. Explore / Navigation Hub Panel                                         */
/* -------------------------------------------------------------------------- */
function NavigationPanel() {
  const { close } = useExpandableTabs();
  const pathname = usePathname();

  const navLinks = [
    {
      title: "Home",
      description: "Overview & Intro",
      href: "/",
      icon: <IconHome className="h-4 w-4 text-sky-500" />,
      active: pathname === "/",
    },
    {
      title: "Projects",
      description: `${projects.length}+ Builds`,
      href: "/projects",
      badge: "Showcase",
      icon: <IconBriefcase className="h-4 w-4 text-emerald-500" />,
      active: pathname.startsWith("/projects"),
    },
    {
      title: "Templates",
      description: `${templates.length}+ Starters`,
      href: "/templates",
      badge: "UI Kits",
      icon: <IconTemplate className="h-4 w-4 text-cyan-500" />,
      active: pathname.startsWith("/templates"),
    },
    {
      title: "Blogs",
      description: "Articles & Guides",
      href: "/blog",
      badge: "Articles",
      icon: <IconNotebook className="h-4 w-4 text-amber-500" />,
      active: pathname.startsWith("/blog"),
    },
    {
      title: "Experience",
      description: "Career Journey",
      href: "/#experience",
      icon: <IconStack2 className="h-4 w-4 text-violet-500" />,
      active: false,
    },
    {
      title: "Download CV",
      description: "Official Resume",
      href: "/resume/Gyanranjan_Priyam_Resume.pdf",
      badge: "PDF",
      external: true,
      icon: <IconDownload className="h-4 w-4 text-rose-500" />,
      active: false,
    },
  ];

  return (
    <div className="w-[300px] sm:w-[350px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Navigation
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Jump to any section or page
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-white/50 dark:bg-white/10 px-2 py-0.5 text-[9.5px] font-medium text-foreground backdrop-blur-md border border-white/40 dark:border-white/10">
          Quick Jump
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {navLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={() => close()}
            className={`group relative flex items-center gap-2 rounded-xl p-2 transition-all duration-200 backdrop-blur-md cursor-pointer ${
              link.active
                ? "bg-primary/15 border border-primary/30 text-primary font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                : "bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-foreground hover:scale-[1.01]"
            }`}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-neutral-800/80 shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-white/60 dark:border-white/15 group-hover:scale-105 transition-transform">
              {link.icon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold truncate">
                  {link.title}
                </span>
                {link.badge && (
                  <span className="rounded bg-white/60 dark:bg-white/10 px-1 py-0.2 text-[8.5px] font-medium text-muted-foreground border border-white/30 dark:border-white/10">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground truncate">
                {link.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Featured Projects Hub Panel                                            */
/* -------------------------------------------------------------------------- */
function ProjectsPanel() {
  const { close } = useExpandableTabs();
  const featured = projects.slice(0, 3);

  return (
    <div className="w-[305px] sm:w-[355px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Featured Projects
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Selected full-stack & AI products
          </p>
        </div>
        <Link
          href="/projects"
          onClick={() => close()}
          className="text-[10.5px] font-medium text-primary hover:underline flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20 cursor-pointer"
        >
          All ({projects.length})
          <IconExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-1.5">
        {featured.map((p) => (
          <Link
            key={p.id}
            href={`/projects`}
            onClick={() => close()}
            className="group flex items-start gap-2.5 rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-primary/20 to-primary/5 text-primary border border-primary/25 shadow-sm group-hover:scale-105 transition-transform">
              <IconFolderCode className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {p.title}
                </span>
                <span className="text-[9.5px] font-mono text-muted-foreground">
                  {p.date}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                {Array.isArray(p.desc) ? p.desc[0] : p.desc}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-white/60 dark:bg-white/10 px-1.5 py-0.5 text-[8.5px] font-medium text-muted-foreground border border-white/30 dark:border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Templates Hub Panel                                                    */
/* -------------------------------------------------------------------------- */
function TemplatesPanel() {
  const { close } = useExpandableTabs();

  return (
    <div className="w-[305px] sm:w-[355px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Web Templates
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Production-ready UI & starter kits
          </p>
        </div>
        <Link
          href="/templates"
          onClick={() => close()}
          className="text-[10.5px] font-medium text-primary hover:underline flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20 cursor-pointer"
        >
          All ({templates.length})
          <IconExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-1.5">
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/templates`}
            onClick={() => close()}
            className="group flex items-start gap-2.5 rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 shadow-sm group-hover:scale-105 transition-transform">
              <IconTemplate className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {t.title}
                </span>
                <span className="text-[9.5px] font-mono text-muted-foreground">
                  {t.category}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                {Array.isArray(t.desc) ? t.desc[0] : t.desc}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {t.tech.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-white/60 dark:bg-white/10 px-1.5 py-0.5 text-[8.5px] font-medium text-muted-foreground border border-white/30 dark:border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Blogs Hub Panel                                                        */
/* -------------------------------------------------------------------------- */
function BlogsPanel() {
  const { close } = useExpandableTabs();

  const blogCategories = [
    {
      title: "Frontend Engineering",
      desc: "React 19, Next.js App Router, RSC & Speed",
      icon: <IconCode className="h-4 w-4 text-sky-500" />,
      tag: "Deep Dives",
    },
    {
      title: "Creative Animations",
      desc: "GSAP, Framer Motion & Dynamic Canvas",
      icon: <IconSparkles className="h-4 w-4 text-amber-500" />,
      tag: "UI Motion",
    },
    {
      title: "System Design & AI",
      desc: "Full-Stack Architecture & LLM Tools",
      icon: <IconStack2 className="h-4 w-4 text-violet-500" />,
      tag: "Architecture",
    },
  ];

  return (
    <div className="w-[300px] sm:w-[350px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Blogs & Articles
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Engineering insights & tutorials
          </p>
        </div>
        <Link
          href="/blog"
          onClick={() => close()}
          className="text-[10.5px] font-medium text-primary hover:underline flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20 cursor-pointer"
        >
          Browse All
          <IconExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-1.5">
        {blogCategories.map((b) => (
          <Link
            key={b.title}
            href="/blog"
            onClick={() => close()}
            className="group flex items-center justify-between rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-neutral-800/80 border border-white/60 dark:border-white/15 shadow-sm group-hover:scale-105 transition-transform">
                {b.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {b.title}
                  </span>
                  <span className="rounded bg-white/60 dark:bg-white/10 px-1 py-0.2 text-[8.5px] font-medium text-muted-foreground border border-white/30 dark:border-white/10">
                    {b.tag}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground truncate">
                  {b.desc}
                </span>
              </div>
            </div>
            <IconExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0 ml-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Connect & Socials Hub Panel                                            */
/* -------------------------------------------------------------------------- */
function SocialsPanel() {
  const [copied, setCopied] = useState(false);

  const socials = [
    {
      title: "GitHub",
      handle: "@Gyanranjan-Priyam",
      href: "https://github.com/gyanranjan-priyam",
      icon: <IconBrandGithub className="h-4 w-4" />,
    },
    {
      title: "LinkedIn",
      handle: "gyanranjan-priyam",
      href: "https://linkedin.com/in/gyanranjan-priyam",
      icon: <IconBrandLinkedin className="h-4 w-4 text-[#0077B5]" />,
    },
    {
      title: "Instagram",
      handle: "@gyanranjanpriyam",
      href: "https://instagram.com/gyanranjanpriyam",
      icon: <IconBrandInstagram className="h-4 w-4 text-[#E4405F]" />,
    },
  ];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      toast.success("Email copied to clipboard! ✨", {
        description: EMAIL_ADDRESS,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy email.");
    }
  };

  return (
    <div className="w-[280px] sm:w-[325px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Let&apos;s Connect
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Social profiles & direct reach out
          </p>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Social Links List */}
      <div className="grid grid-cols-1 gap-1.5 mb-2">
        {socials.map((s) => (
          <a
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 dark:bg-neutral-800/80 border border-white/60 dark:border-white/15 shadow-sm">
                {s.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">
                  {s.title}
                </span>
                <span className="text-[9.5px] text-muted-foreground">
                  {s.handle}
                </span>
              </div>
            </div>
            <IconExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
          </a>
        ))}
      </div>

      {/* Liquid Glass Email Box */}
      <div className="flex items-center justify-between gap-1.5 rounded-xl p-2 backdrop-blur-md bg-white/50 dark:bg-white/[0.06] border border-white/50 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-primary shadow-sm">
            <IconMail className="h-3 w-3" />
          </div>
          <span className="text-xs font-mono truncate text-foreground">
            {EMAIL_ADDRESS}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/50 dark:border-white/15 bg-white/60 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 text-muted-foreground hover:text-foreground transition-all shadow-sm cursor-pointer"
          >
            {copied ? (
              <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <IconCopy className="h-3.5 w-3.5" />
            )}
          </button>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            title="Send email"
            className="flex h-6 px-2 items-center justify-center rounded-lg bg-primary text-primary-foreground text-[10.5px] font-semibold hover:opacity-90 transition-opacity shadow-[0_2px_6px_rgba(0,0,0,0.08)] cursor-pointer"
          >
            Send
          </a>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Tools & Settings Hub Panel                                             */
/* -------------------------------------------------------------------------- */
function ToolsPanel() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    toast.success(`Switched to ${nextDark ? "Dark" : "Light"} mode 🌗`);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: "Gyanranjan Priyam — Full Stack Developer",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Portfolio URL copied to clipboard! 🚀");
      }
    } catch {
      // User dismissed share dialog
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Scrolled to top ⬆️");
  };

  return (
    <div className="w-[270px] sm:w-[310px]">
      {/* Liquid Glass Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/30 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Tools & Settings
          </h3>
          <p className="text-[10.5px] text-muted-foreground">
            Customization & quick actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex flex-col items-start gap-1 rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all text-left cursor-pointer"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/25 shadow-sm">
            {isDark ? (
              <IconMoon className="h-3.5 w-3.5" />
            ) : (
              <IconSun className="h-3.5 w-3.5" />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Theme</div>
            <div className="text-[9.5px] text-muted-foreground">
              {isDark ? "Dark Mode" : "Light Mode"}
            </div>
          </div>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-start gap-1 rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.01] transition-all text-left cursor-pointer"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/25 shadow-sm">
            <IconShare className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Share</div>
            <div className="text-[9.5px] text-muted-foreground">Copy URL</div>
          </div>
        </button>
      </div>

      {/* Scroll to Top */}
      <button
        type="button"
        onClick={handleScrollTop}
        className="w-full flex items-center justify-between rounded-xl p-2 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] hover:bg-white/70 dark:hover:bg-white/[0.09] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-foreground hover:scale-[1.01] transition-all mb-1.5 cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/60 dark:bg-white/10 text-muted-foreground border border-white/30 dark:border-white/10">
            <IconArrowUp className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold">Scroll to top</span>
        </div>
        <span className="text-[9.5px] text-muted-foreground">Smooth</span>
      </button>

      {/* Availability Status */}
      <div className="flex items-center gap-2 rounded-xl p-2 backdrop-blur-md bg-emerald-500/10 dark:bg-emerald-500/[0.08] border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
        <span className="flex h-1.5 w-1.5 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <div className="text-[9.5px] text-emerald-700 dark:text-emerald-300 font-medium leading-tight">
          Available for freelance & full-time engineering roles
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main NavigationDock Component                                              */
/* -------------------------------------------------------------------------- */
export function NavigationDock() {
  const [hideBar, setHideBar] = useState(false);
  const isLoading = useLoaderStore((s) => s.isLoading);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideBar(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return null;

  const items: ExpandableTabsItem[] = [
    {
      id: "explore",
      label: "Explore",
      icon: <IconCompass className="h-4 w-4" />,
      content: <NavigationPanel />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <IconBriefcase className="h-4 w-4" />,
      content: <ProjectsPanel />,
    },
    {
      id: "templates",
      label: "Templates",
      icon: <IconTemplate className="h-4 w-4" />,
      content: <TemplatesPanel />,
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: <IconNotebook className="h-4 w-4" />,
      content: <BlogsPanel />,
    },
    {
      id: "connect",
      label: "Connect",
      icon: <IconBrandGithub className="h-4 w-4" />,
      content: <SocialsPanel />,
    },
    {
      id: "tools",
      label: "Tools",
      icon: <IconSparkles className="h-4 w-4" />,
      content: <ToolsPanel />,
    },
  ];

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-50 flex items-end justify-center px-3 transition-all duration-300 ease-out md:bottom-6 ${
        hideBar
          ? "translate-y-12 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100 pointer-events-auto"
      }`}
    >
      <ExpandableTabs items={items} />
    </div>
  );
}
