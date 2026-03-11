"use client";

import {
  Home,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "motion/react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const dockItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: FileText, label: "Resume", href: "/resume.pdf", external: true },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com",
    external: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com",
    external: true,
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com",
    external: true,
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com",
    external: true,
  },
];

const DEFAULT_SIZE = 40;
const MAGNIFICATION = 64;
const DISTANCE = 140;

function DockIcon({
  mouseX,
  icon: Icon,
  label,
  href,
  external,
  onClick,
}: {
  mouseX: MotionValue<number>;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (!el || val === -1) return DISTANCE + 1;
    const rect = el.getBoundingClientRect();
    return val - rect.left - rect.width / 2;
  });

  const sizeTransform = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [DEFAULT_SIZE, MAGNIFICATION, DEFAULT_SIZE]
  );
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md"
          >
            {label}
            <div className="absolute -bottom-[3px] left-1/2 size-1.5 -translate-x-1/2 rotate-45 bg-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full bg-black/5 text-muted-foreground transition-colors hover:text-foreground dark:bg-white/10"
        >
          <Icon className="size-[55%]" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full bg-black/5 text-muted-foreground transition-colors hover:text-foreground dark:bg-white/10"
        >
          <Icon className="size-[55%]" />
        </button>
      )}
    </motion.div>
  );
}

function ThemeDockIcon({ mouseX }: { mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (!el || val === -1) return DISTANCE + 1;
    const rect = el.getBoundingClientRect();
    return val - rect.left - rect.width / 2;
  });

  const sizeTransform = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [DEFAULT_SIZE, MAGNIFICATION, DEFAULT_SIZE]
  );
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md"
          >
            Toggle theme
            <div className="absolute -bottom-[3px] left-1/2 size-1.5 -translate-x-1/2 rotate-45 bg-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatedThemeToggler
        aria-label="Toggle theme"
        className="flex size-full items-center justify-center rounded-full bg-black/5 text-muted-foreground transition-colors hover:text-foreground dark:bg-white/10 [&_svg]:size-[55%]"
      />
    </motion.div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(-1);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(-1)}
        className="flex items-end gap-2 rounded-2xl border border-border/40 bg-background/50 px-3 pb-2.5 pt-2.5 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl dark:ring-white/10"
      >
        {dockItems.map((item) => (
          <DockIcon
            key={item.label}
            mouseX={mouseX}
            icon={item.icon}
            label={item.label}
            href={item.href}
            external={item.external}
          />
        ))}

        {/* Separator */}
        <div className="mx-0.5 h-8 w-px self-center bg-border/50" />

        <ThemeDockIcon mouseX={mouseX} />
      </motion.div>
    </div>
  );
}
