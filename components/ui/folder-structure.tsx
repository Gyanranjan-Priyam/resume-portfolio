"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconFolder,
  IconFolderOpen,
  IconChevronRight,
  IconCopy,
  IconCheck,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandReact,
  IconBrandCss3,
  IconBrandSass,
  IconJson,
  IconMarkdown,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconTypography,
  IconSettings,
  IconDatabase,
  IconLock,
  IconBrandGit,
  IconBrandPrisma,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandHtml5,
  IconBrandPython,
  IconBrandDocker,
  IconBrandNodejs,
  IconFileCode,
  IconFile,
  IconFileSymlink,
} from "@tabler/icons-react";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

// ── File icon based on extension ─────────────────────────────────────────────
function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const fileName = name.toLowerCase();
  
  const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
    ts: { icon: <IconBrandTypescript size={16} stroke={1.5} />, color: "#3178c6" },
    tsx: { icon: <IconBrandReact size={16} stroke={1.5} />, color: "#61dafb" },
    js: { icon: <IconBrandJavascript size={16} stroke={1.5} />, color: "#f7df1e" },
    jsx: { icon: <IconBrandReact size={16} stroke={1.5} />, color: "#61dafb" },
    mjs: { icon: <IconBrandJavascript size={16} stroke={1.5} />, color: "#f7df1e" },
    cjs: { icon: <IconBrandJavascript size={16} stroke={1.5} />, color: "#f7df1e" },
    css: { icon: <IconBrandCss3 size={16} stroke={1.5} />, color: "#264de4" },
    scss: { icon: <IconBrandSass size={16} stroke={1.5} />, color: "#cc6699" },
    sass: { icon: <IconBrandSass size={16} stroke={1.5} />, color: "#cc6699" },
    json: { icon: <IconJson size={16} stroke={1.5} />, color: "#cbcb41" },
    yaml: { icon: <IconFileSymlink size={16} stroke={1.5} />, color: "#cb171e" },
    yml: { icon: <IconFileSymlink size={16} stroke={1.5} />, color: "#cb171e" },
    md: { icon: <IconMarkdown size={16} stroke={1.5} />, color: "#083fa1" },
    mdx: { icon: <IconMarkdown size={16} stroke={1.5} />, color: "#fcb32c" },
    txt: { icon: <IconFileText size={16} stroke={1.5} />, color: "#89898a" },
    svg: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#ffb13b" },
    png: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    jpg: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    jpeg: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    webp: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    gif: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    ico: { icon: <IconPhoto size={16} stroke={1.5} />, color: "#a074c4" },
    mp4: { icon: <IconVideo size={16} stroke={1.5} />, color: "#fd4d4d" },
    webm: { icon: <IconVideo size={16} stroke={1.5} />, color: "#fd4d4d" },
    otf: { icon: <IconTypography size={16} stroke={1.5} />, color: "#ec5252" },
    ttf: { icon: <IconTypography size={16} stroke={1.5} />, color: "#ec5252" },
    woff: { icon: <IconTypography size={16} stroke={1.5} />, color: "#ec5252" },
    woff2: { icon: <IconTypography size={16} stroke={1.5} />, color: "#ec5252" },
    prisma: { icon: <IconBrandPrisma size={16} stroke={1.5} />, color: "#5a67d8" },
    sql: { icon: <IconDatabase size={16} stroke={1.5} />, color: "#dad8d8" },
    db: { icon: <IconDatabase size={16} stroke={1.5} />, color: "#dad8d8" },
    lock: { icon: <IconLock size={16} stroke={1.5} />, color: "#6b7280" },
    html: { icon: <IconBrandHtml5 size={16} stroke={1.5} />, color: "#e34c26" },
    py: { icon: <IconBrandPython size={16} stroke={1.5} />, color: "#3572A5" },
    dockerfile: { icon: <IconBrandDocker size={16} stroke={1.5} />, color: "#2496ed" },
    sh: { icon: <IconFileCode size={16} stroke={1.5} />, color: "#89e051" },
    bash: { icon: <IconFileCode size={16} stroke={1.5} />, color: "#89e051" },
    zsh: { icon: <IconFileCode size={16} stroke={1.5} />, color: "#89e051" },
  };


  // Check for special filenames
  if (fileName === ".gitignore" || fileName === ".gitattributes") {
    return { icon: <IconBrandGit size={16} stroke={1.5} />, color: "#f14e32" };
  }
  if (fileName.includes(".env")) {
    return { icon: <IconSettings size={16} stroke={1.5} />, color: "#ecd53f" };
  }
  if (fileName === "next.config.ts" || fileName === "next.config.js" || fileName === "next.config.mjs") {
    return { icon: <IconBrandNextjs size={16} stroke={1.5} />, color: "#ffffff" };
  }
  if (fileName === "tailwind.config.ts" || fileName === "tailwind.config.js" || fileName === "postcss.config.mjs") {
    return { icon: <IconBrandTailwind size={16} stroke={1.5} />, color: "#38bdf8" };
  }
  if (fileName === "package.json" || fileName === "package-lock.json") {
    return { icon: <IconBrandNodejs size={16} stroke={1.5} />, color: "#339933" };
  }
  if (fileName === "tsconfig.json") {
    return { icon: <IconBrandTypescript size={16} stroke={1.5} />, color: "#3178c6" };
  }
  if (fileName === "dockerfile" || fileName.startsWith("docker-compose")) {
    return { icon: <IconBrandDocker size={16} stroke={1.5} />, color: "#2496ed" };
  }
  if (fileName.endsWith(".config.ts") || fileName.endsWith(".config.js") || fileName.endsWith(".config.mjs")) {
    return { icon: <IconSettings size={16} stroke={1.5} />, color: "#6b7280" };
  }

  return iconMap[ext] || { icon: <IconFile size={16} stroke={1.5} />, color: "#89898a" };
}

function TreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const fileIcon = !isFolder ? getFileIcon(node.name) : null;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 group select-none ${isFolder ? "cursor-pointer hover:bg-muted/60" : "hover:bg-muted/40"}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={isFolder ? () => setOpen((o) => !o) : undefined}
      >
        {isFolder ? (
          <>
            <IconChevronRight
              size={16}
              stroke={1.5}
              className="shrink-0 text-muted-foreground transition-transform duration-150"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            />
            {open ? (
              <IconFolderOpen size={16} stroke={1.5} className="shrink-0 text-amber-400" />
            ) : (
              <IconFolder size={16} stroke={1.5} className="shrink-0 text-amber-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-4 shrink-0" />
            <span style={{ color: fileIcon?.color }} className="shrink-0">
              {fileIcon?.icon}
            </span>
          </>
        )}
        <span 
          className="text-[13px] leading-6 text-foreground/90 group-hover:text-foreground transition-colors"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {node.name}
        </span>
      </div>

      {isFolder && open && node.children && node.children.length > 0 && (
        <div className="relative">
          {/* vertical guide line */}
          <span
            className="absolute top-0 bottom-0 w-px bg-border/50"
            style={{ left: `${depth * 16 + 18}px` }}
          />
          {node.children.map((child) => (
            <TreeNode
              key={child.name + child.type}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildAscii(nodes: FileNode[], prefix = ""): string {
  return nodes
    .map((node, i) => {
      const isLast = i === nodes.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      const suffix = node.type === "folder" ? "/" : "";
      const line = prefix + connector + node.name + suffix;
      if (node.type === "folder" && node.children?.length) {
        return line + "\n" + buildAscii(node.children, childPrefix);
      }
      return line;
    })
    .join("\n");
}

export function FolderStructure({ structure }: { structure: FileNode[] }) {
  const [tab, setTab] = useState<"tree" | "md">("tree");
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ascii = buildAscii(structure);

  const handleCopy = () => {
    navigator.clipboard.writeText("```\n" + ascii + "\n```");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Proper scroll isolation using wheel event
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [tab]);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-2">
        <div
          className="flex"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {(["tree", "md"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                tab === t
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "tree" ? (
                <span className="flex items-center gap-2 font-medium">
                  <IconFolder size={16} stroke={1.5} className="text-amber-400" />
                  Explorer
                </span>
              ) : (
                <span className="flex items-center gap-2 font-medium">
                  <IconMarkdown size={16} stroke={1.5} className="text-blue-500" />
                  README.md
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "md" && (
          <button
            onClick={handleCopy}
            className="mr-2 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Copy markdown"
          >
            {copied ? (
              <>
                <IconCheck size={14} stroke={1.5} className="text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <IconCopy size={14} stroke={1.5} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Content - Fixed height with hidden scrollbar and isolated scroll */}
      {tab === "tree" ? (
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto overflow-x-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {structure.map((node) => (
            <TreeNode key={node.name + node.type} node={node} depth={0} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto overflow-x-auto bg-zinc-950 dark:bg-zinc-900 p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <pre 
            className="text-[13px] leading-7 text-emerald-400 whitespace-pre"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {ascii}
          </pre>
        </div>
      )}
    </div>
  );
}
