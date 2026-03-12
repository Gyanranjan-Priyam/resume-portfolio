"use client";

import { useState } from "react";
import { Folder, FolderOpen, ChevronRight, Copy, Check } from "lucide-react";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

// ── File icon ─────────────────────────────────────────────────────────────────
const EXT_COLORS: Record<string, string> = {
  ts: "#3b82f6",
  tsx: "#38bdf8",
  js: "#facc15",
  jsx: "#61dafb",
  css: "#e879f9",
  scss: "#e879f9",
  json: "#fb923c",
  md: "#4ade80",
  txt: "#94a3b8",
  env: "#86efac",
  prisma: "#818cf8",
  yaml: "#c084fc",
  yml: "#c084fc",
  svg: "#fbbf24",
  png: "#fbbf24",
  jpg: "#fbbf24",
  webp: "#fbbf24",
  mp4: "#f97316",
  otf: "#a78bfa",
  ttf: "#a78bfa",
  gitignore: "#94a3b8",
  lock: "#6b7280",
};

function getExtColor(name: string): string {
  const parts = name.split(".");
  if (parts.length < 2) return "#94a3b8";
  const ext = parts[parts.length - 1].toLowerCase();
  return EXT_COLORS[ext] ?? "#94a3b8";
}

function FileIcon({ name }: { name: string }) {
  return (
    <span
      className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-xs"
      style={{ backgroundColor: getExtColor(name) + "30", border: `1px solid ${getExtColor(name)}60` }}
    >
      <span
        className="size-1.5 rounded-[1px]"
        style={{ backgroundColor: getExtColor(name) }}
      />
    </span>
  );
}

// ── Tree node (recursive) ──────────────────────────────────────────────────────
function TreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 rounded px-1 py-0.5 group select-none ${isFolder ? "cursor-pointer hover:bg-muted/60" : "hover:bg-muted/40"}`}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        onClick={isFolder ? () => setOpen((o) => !o) : undefined}
      >
        {isFolder ? (
          <>
            <ChevronRight
              className="size-3 shrink-0 text-muted-foreground transition-transform duration-150"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            />
            {open ? (
              <FolderOpen className="size-3.5 shrink-0 text-amber-400" />
            ) : (
              <Folder className="size-3.5 shrink-0 text-amber-400" />
            )}
          </>
        ) : (
          <>
            <span className="size-3 shrink-0" />
            <FileIcon name={node.name} />
          </>
        )}
        <span className="text-[11.5px] font-mono leading-5 text-foreground/80 group-hover:text-foreground transition-colors">
          {node.name}
        </span>
      </div>

      {isFolder && open && node.children && node.children.length > 0 && (
        <div className="relative">
          {/* vertical guide line */}
          <span
            className="absolute top-0 bottom-0 w-px bg-border/60"
            style={{ left: `${depth * 14 + 10}px` }}
          />
          {node.children.map((child) => (
            <TreeNode key={child.name + child.type} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ASCII tree builder ─────────────────────────────────────────────────────────
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

// ── Main export ────────────────────────────────────────────────────────────────
export function FolderStructure({
  structure,
}: {
  structure: FileNode[];
}) {
  const [tab, setTab] = useState<"tree" | "md">("tree");
  const [copied, setCopied] = useState(false);

  const ascii = buildAscii(structure);

  const handleCopy = () => {
    navigator.clipboard.writeText("```\n" + ascii + "\n```");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-1">
        <div className="flex">
          {(["tree", "md"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3.5 py-2 text-[11px] font-medium transition-colors ${
                tab === t
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "tree" ? (
                <span className="flex items-center gap-1.5">
                  <Folder className="size-3" />
                  Explorer
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold leading-none text-green-500">MD</span>
                  README.md
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "md" && (
          <button
            onClick={handleCopy}
            className="mr-2 flex items-center gap-1 rounded px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Copy markdown"
          >
            {copied ? (
              <>
                <Check className="size-3 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {tab === "tree" ? (
        <div className="overflow-x-auto p-2">
          {structure.map((node) => (
            <TreeNode key={node.name + node.type} node={node} depth={0} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-zinc-950 dark:bg-zinc-900 p-4">
          <pre className="text-[11.5px] font-mono leading-[1.65] text-emerald-400 whitespace-pre">
            {ascii}
          </pre>
        </div>
      )}
    </div>
  );
}
