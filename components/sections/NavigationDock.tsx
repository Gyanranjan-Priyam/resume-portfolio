"use client";

import { FloatingDock } from "../ui/dock";
import { useEffect, useState } from "react";
import { useLoaderStore } from "@/components/loader-component";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBriefcase,
  IconNotebook,
  IconHome,
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";

const links = [
  {
    title: "Home",
    icon: (
      <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/",
  },
  {
    title: "Projects",
    icon: (
      <IconBriefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/projects",
  },
  {
    title: "Blog",
    icon: (
      <IconNotebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/blog",
  },
  {
    title: "X",
    icon: (
      <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://x.com/gr_priyam",
  },
  {
    title: "LinkedIn",
    icon: (
      <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://linkedin.com/in/gyanranjan-priyam",
  },
  {
    title: "GitHub",
    icon: (
      <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://github.com/gyanranjan-priyam",
  },
  {
    title: "Instagram",
    icon: (
      <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://instagram.com/gyanranjanpriyam",
  },
  {
    title: "Mail",
    icon: (
      <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "mailto:info@priyam.tech",
  },
];

export function NavigationDock() {
  const [hideDesktopDock, setHideDesktopDock] = useState(false);
  const isLoading = useLoaderStore((s) => s.isLoading);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideDesktopDock(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex items-end justify-center px-3 md:bottom-5">
      <FloatingDock
        desktopClassName={`pointer-events-auto transition-all duration-300 ease-out ${
          hideDesktopDock ? "md:translate-y-8 md:opacity-0 md:pointer-events-none" : "md:translate-y-0 md:opacity-100"
        }`}
        mobileClassName="pointer-events-auto fixed right-4 bottom-4"
        items={links}
      />
    </div>
  );
}
