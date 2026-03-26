/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, ChevronRight, Clock, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Separator } from "../ui/separator";
import AuthorBio from "./author-bio";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TiptapImage from "@tiptap/extension-image";
import TiptapParagraph from "@tiptap/extension-paragraph";
import TiptapHeading from "@tiptap/extension-heading";
import { MonacoCodeBlock } from "@/components/ui/monaco-code-block";
import { TableRenderer } from "@/components/ui/table-renderer";
import { IconFileExport, IconFileTypeDocx, IconMarkdown } from "@tabler/icons-react";

/* ── Types ── */
export type BlogComponent = {
  id: string;
  type: "richtext" | "imagetext" | "imageuploader" | "videoplayer" | "code" | "table";
  order: number;
  content?: unknown; // Tiptap JSON for richtext, code object for code blocks, or table data for tables
  text?: string | null; // Text for imagetext component
  imageKey?: string | null; // S3 key for images
  alignment?: string | null; // "left" | "right" for imagetext
  videoUrl?: string | null; // Video URL
  videoType?: string | null; // "youtube" | "drive" | "cloudinary" | "direct"
};

export type BlogUser = {
  id: string;
  name: string;
  username?: string | null;
  image?: string | null;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailKey?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  components: BlogComponent[];
  user?: BlogUser;
};

/* ── Heading Type for TOC ── */
interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

const ParagraphWithOptionalId = TiptapParagraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.id) return {};
          return {
            id: attributes.id as string,
            class: "scroll-mt-24",
          };
        },
      },
    };
  },
});

const HeadingWithOptionalId = TiptapHeading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.id) return {};
          return {
            id: attributes.id as string,
            class: "scroll-mt-24",
          };
        },
      },
    };
  },
});

/* ── Tiptap Extensions for HTML Generation ── */
const extensions = [
  StarterKit.configure({
    bulletList: false,
    orderedList: false,
    listItem: false,
    paragraph: false,
    heading: false,
  }),
  ParagraphWithOptionalId,
  HeadingWithOptionalId,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  TextStyle,
  FontSize,
  Color,
  TiptapLink.configure({
    openOnClick: false,
  }),
  FontFamily,
  BulletList.configure({
    HTMLAttributes: {
      class: "my-bullet-list",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "my-ordered-list",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "my-list-item",
    },
  }),
  TiptapImage,
];

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getImageUrl(key: string | null | undefined): string {
  if (!key) return "";
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES || "blogs";
  return `https://${bucketName}.t3.storage.dev/${key}`;
}

function extractTextFromTiptap(content: unknown): string {
  if (!content || typeof content !== "object") return "";

  const doc = content as {
    content?: Array<{
      type: string;
      content?: Array<{ text?: string; content?: unknown[] }>;
    }>;
  };
  if (!doc.content) return "";

  const texts: string[] = [];

  function traverse(nodes: unknown[]) {
    for (const node of nodes) {
      if (typeof node !== "object" || !node) continue;
      const n = node as { type?: string; text?: string; content?: unknown[] };
      if (n.text) {
        texts.push(n.text);
      }
      if (n.content && Array.isArray(n.content)) {
        traverse(n.content);
      }
    }
  }

  traverse(doc.content);
  return texts.join(" ");
}

/** Parse font-size mark values from the editor (e.g. "30px", "30", "18pt"). */
function parseFontSizeToPx(value: string | null | undefined): number {
  if (!value) return 0;
  const s = String(value).trim();
  const px = s.match(/^([\d.]+)\s*px$/i);
  if (px) return parseFloat(px[1]);
  const bare = s.match(/^([\d.]+)$/);
  if (bare) return parseFloat(bare[1]);
  const pt = s.match(/^([\d.]+)\s*pt$/i);
  if (pt) return parseFloat(pt[1]) * (96 / 72);
  const em = s.match(/^([\d.]+)\s*em$/i);
  if (em) return parseFloat(em[1]) * 16;
  return 0;
}

function extractPlainTextFromBlock(node: unknown): string {
  if (typeof node !== "object" || !node) return "";
  function walk(n: unknown): string {
    if (typeof n !== "object" || !n) return "";
    const o = n as {
      type?: string;
      text?: string;
      content?: unknown[];
    };
    if (o.type === "text" && o.text) return o.text;
    if (o.content && Array.isArray(o.content)) {
      return o.content.map(walk).join("");
    }
    return "";
  }
  return walk(node);
}

function getMaxFontSizeInDoc(doc: { content?: unknown[] }): number {
  let max = 0;
  function walk(nodes: unknown[] | undefined) {
    if (!nodes) return;
    for (const raw of nodes) {
      if (typeof raw !== "object" || !raw) continue;
      const n = raw as {
        type?: string;
        marks?: Array<{
          type?: string;
          attrs?: { fontSize?: string | null };
        }>;
        content?: unknown[];
      };
      if (n.type === "text" && n.marks) {
        for (const m of n.marks) {
          if (m.type === "textStyle" && m.attrs?.fontSize) {
            const v = parseFontSizeToPx(m.attrs.fontSize);
            if (v > max) max = v;
          }
        }
      }
      if (n.content) walk(n.content as unknown[]);
    }
  }
  walk(doc.content);
  return max;
}

function getBlockMaxFontSize(node: { content?: unknown[] }): number {
  let max = 0;
  function walk(nodes: unknown[] | undefined) {
    if (!nodes) return;
    for (const raw of nodes) {
      if (typeof raw !== "object" || !raw) continue;
      const n = raw as {
        type?: string;
        marks?: Array<{
          type?: string;
          attrs?: { fontSize?: string | null };
        }>;
        content?: unknown[];
      };
      if (n.type === "text" && n.marks) {
        for (const m of n.marks) {
          if (m.type === "textStyle" && m.attrs?.fontSize) {
            const v = parseFontSizeToPx(m.attrs.fontSize);
            if (v > max) max = v;
          }
        }
      }
      if (n.content) walk(n.content as unknown[]);
    }
  }
  walk(node.content);
  return max;
}

/**
 * TOC entries = semantic H1, or paragraphs / headings whose inline font-size
 * is exactly 20px.
 */
function qualifiesAsTocBlock(
  node: { type?: string; attrs?: { level?: number }; content?: unknown[] },
  _maxInDoc: number,
): boolean {
  const text = extractPlainTextFromBlock(node).trim();
  if (!text) return false;
  if (node.type === "heading" && node.attrs?.level === 1) return true;
  // Include blocks with font-size 20px as TOC headings
  return getBlockMaxFontSize(node) === 20;
}

function extractTocEntriesFromTiptap(
  content: unknown,
  headingCounter: { current: number },
): { id: string; text: string; level: number }[] {
  const doc = content as { content?: unknown[] };
  if (!doc.content) return [];
  const maxInDoc = getMaxFontSizeInDoc(doc);
  const headings: { id: string; text: string; level: number }[] = [];

  function visit(nodes: unknown[] | undefined) {
    if (!nodes) return;
    for (const raw of nodes) {
      if (typeof raw !== "object" || !raw) continue;
      const n = raw as {
        type?: string;
        attrs?: { level?: number };
        content?: unknown[];
      };
      if (n.type === "paragraph" || n.type === "heading") {
        if (qualifiesAsTocBlock(n, maxInDoc)) {
          const text = extractPlainTextFromBlock(n).trim();
          if (text) {
            headings.push({
              id: `heading-${headingCounter.current++}`,
              text,
              level: 1,
            });
          }
        }
      }
      if (n.content) visit(n.content as unknown[]);
    }
  }

  visit(doc.content);
  return headings;
}

function injectTocIdsIntoContent(
  content: unknown,
  tocEntries: { id: string }[],
): unknown {
  if (!tocEntries.length) return content;
  const cloned = JSON.parse(JSON.stringify(content)) as { content?: unknown[] };
  const maxInDoc = getMaxFontSizeInDoc(cloned);
  let idx = 0;

  function visit(nodes: unknown[] | undefined) {
    if (!nodes || idx >= tocEntries.length) return;
    for (const raw of nodes) {
      if (typeof raw !== "object" || !raw) continue;
      const node = raw as {
        type?: string;
        attrs?: Record<string, unknown>;
        content?: unknown[];
      };
      if (node.type === "paragraph" || node.type === "heading") {
        if (
          qualifiesAsTocBlock(
            node as {
              type?: string;
              attrs?: { level?: number };
              content?: unknown[];
            },
            maxInDoc,
          )
        ) {
          node.attrs = { ...node.attrs, id: tocEntries[idx].id };
          idx += 1;
          if (idx >= tocEntries.length) return;
        }
      }
      if (node.content) visit(node.content as unknown[]);
    }
  }

  visit(cloned.content);
  return cloned;
}

function getAllHeadingIdsFlat(headingList: Heading[]): string[] {
  const ids: string[] = [];
  headingList.forEach((h) => {
    ids.push(h.id);
    if (h.children?.length) {
      ids.push(...getAllHeadingIdsFlat(h.children));
    }
  });
  return ids;
}

function getAllHeadingsFlatList(headingList: Heading[]): Heading[] {
  const flat: Heading[] = [];
  headingList.forEach((h) => {
    flat.push(h);
    if (h.children?.length) {
      flat.push(...getAllHeadingsFlatList(h.children));
    }
  });
  return flat;
}

// Build hierarchical structure for headings
function buildHeadingHierarchy(
  flatHeadings: { id: string; text: string; level: number }[],
): Heading[] {
  const hierarchy: Heading[] = [];
  const stack: Heading[] = [];

  flatHeadings.forEach((heading) => {
    const newHeading: Heading = { ...heading, children: [] };

    while (
      stack.length > 0 &&
      stack[stack.length - 1].level >= newHeading.level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      hierarchy.push(newHeading);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(newHeading);
    }

    stack.push(newHeading);
  });

  return hierarchy;
}

function calculateReadingTimeFromComponents(
  components: BlogComponent[],
): string {
  const WORDS_PER_MINUTE = 238;
  let totalText = "";

  for (const comp of components) {
    if (comp.type === "richtext" && comp.content) {
      totalText += " " + extractTextFromTiptap(comp.content);
    } else if (comp.type === "imagetext" && comp.text) {
      totalText += " " + comp.text;
    }
  }

  const wordCount = totalText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}

function getVideoEmbedUrl(
  url: string,
  type: string | null | undefined,
): string {
  if (!url) return "";

  switch (type) {
    case "youtube": {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      )?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    case "drive": {
      const fileId = url.match(/\/d\/([^\/]+)/)?.[1];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }
    default:
      return url;
  }
}

function addHeadingAttributes(html: string): string {
  // Add data-heading and scroll-mt-16 to h1, h2, h3, etc.
  return html.replace(
    /<(h[1-6])([^>]*)>([^<]*)<\/\1>/gi,
    (match, tag, attrs, content) => {
      const trimmedContent = content.trim();
      // Add class for scroll margin and data-heading attribute
      const existingClass = attrs.match(/class="([^"]*)"/);
      const newClass = existingClass
        ? attrs.replace(/class="([^"]*)"/, `class="$1 scroll-mt-16"`)
        : `${attrs} class="scroll-mt-16"`;
      return `<${tag}${newClass} data-heading="${trimmedContent}">${content}</${tag}>`;
    },
  );
}

function getShareUrl(platform: string, url: string, title: string) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encoded}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`;
    default:
      return null;
  }
}

/* ── Rich Content Renderer with Code Block Support ── */
function RichContentRenderer({ html }: { html: string }) {
  // Split HTML by code blocks and render them with MonacoCodeBlock
  const parts = useMemo(() => {
    const codeBlockRegex = /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/gi;
    const result: Array<{ type: "html" | "code"; content: string; language?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(html)) !== null) {
      // Add HTML before the code block
      if (match.index > lastIndex) {
        result.push({ type: "html", content: html.slice(lastIndex, match.index) });
      }
      // Decode HTML entities in code content
      const codeContent = match[2]
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
      result.push({ type: "code", content: codeContent, language: match[1] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining HTML after last code block
    if (lastIndex < html.length) {
      result.push({ type: "html", content: html.slice(lastIndex) });
    }

    return result;
  }, [html]);

  return (
    <>
      {parts.map((part, index) =>
        part.type === "code" ? (
          <MonacoCodeBlock key={index} code={part.content} />
        ) : (
          <div
            key={index}
            className="tiptap-content prose prose-base max-w-none dark:prose-invert [&_p]:my-4 [&_p]:leading-8 [&_li]:my-1.5 [&_li]:leading-8 [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:p-3 [&_td]:p-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        )
      )}
    </>
  );
}

/* ── Code Block Renderer ── */
function CodeBlockRenderer({ 
  code, 
  fileName, 
  language 
}: { 
  code: string; 
  fileName?: string; 
  language?: string;
}) {
  return (
    <MonacoCodeBlock 
      code={code} 
      fileName={fileName} 
      language={language} 
    />
  );
}

/* ── SVG Icons ── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ReadAloudIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px]"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export type NextBlog = {
  [x: string]: string;
  id: string;
  slug: string;
  title: string;
  createdAt: string;
};

/* ── Main Component ── */
export function BlogPostClient({
  blog,
  nextBlog,
}: {
  blog: Blog;
  nextBlog: NextBlog;
}) {
  const [isReading, setIsReading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [highlightedHeadingId, setHighlightedHeadingId] = useState<string>("");
  const tocNavRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // TOC from semantic H1 and from largest inline font sizes (editor-style body text)
  const { headings, displayComponents } = useMemo(() => {
    const headingCounter = { current: 0 };
    const flatHeadings: { id: string; text: string; level: number }[] = [];
    const displayComponents = blog.components.map((comp) => {
      if (comp.type === "richtext" && comp.content) {
        const entries = extractTocEntriesFromTiptap(comp.content, headingCounter);
        flatHeadings.push(...entries);
        const newContent =
          entries.length > 0
            ? injectTocIdsIntoContent(comp.content, entries)
            : comp.content;
        return { ...comp, content: newContent };
      }
      return comp;
    });
    return {
      headings: buildHeadingHierarchy(flatHeadings),
      displayComponents,
    };
  }, [blog.components]);

  const readingTime = useMemo(
    () => calculateReadingTimeFromComponents(blog.components),
    [blog.components],
  );

  const blogUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${blog.slug}`
      : `https://www.priyam.tech/blog/${blog.slug}`;

  const handleShare = useCallback(
    (platform: string) => {
      const url = getShareUrl(platform, blogUrl, blog.title);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      setShareOpen(false);
    },
    [blogUrl, blog.title],
  );

  const getArticleText = useCallback(() => {
    const parts = [blog.title, blog.shortDescription];
    for (const comp of blog.components) {
      if (comp.type === "richtext" && comp.content) {
        parts.push(extractTextFromTiptap(comp.content));
      } else if (comp.type === "imagetext" && comp.text) {
        parts.push(comp.text);
      }
    }
    return parts.join(". ");
  }, [blog]);

  const getMarkdown = useCallback(() => {
    let md = `# ${blog.title}\n\n${blog.shortDescription}\n\n`;

    for (const comp of blog.components) {
      if (comp.type === "richtext" && comp.content) {
        const text = extractTextFromTiptap(comp.content);
        md += `${text}\n\n`;
      } else if (comp.type === "imagetext") {
        if (comp.text) {
          md += `${comp.text}\n\n`;
        }
        if (comp.imageKey) {
          md += `![Image](${getImageUrl(comp.imageKey)})\n\n`;
        }
      } else if (comp.type === "imageuploader" && comp.imageKey) {
        md += `![Image](${getImageUrl(comp.imageKey)})\n\n`;
      }
    }

    return md;
  }, [blog]);

  const handleCopyMarkdown = () => {
    const md = getMarkdown();
    navigator.clipboard.writeText(md);
    toast.success("Markdown copied to clipboard!");
    setMenuOpen(false);
  };

  const handleOpenChatGPT = () => {
    const md = encodeURIComponent(getMarkdown());
    window.open(`https://chat.openai.com/?q=${md}`, "_blank");
  };

  const handleDownloadDocx = async () => {
    try {
      const children: Paragraph[] = [];

      // Title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: blog.title,
              bold: true,
              size: 32,
            }),
          ],
          spacing: { after: 300 },
        }),
      );

      // Short Description
      children.push(
        new Paragraph({
          children: [new TextRun(blog.shortDescription)],
          spacing: { after: 300 },
        }),
      );

      // Content from components
      for (const comp of blog.components) {
        if (comp.type === "richtext" && comp.content) {
          const text = extractTextFromTiptap(comp.content);
          if (text) {
            children.push(
              new Paragraph({
                children: [new TextRun(text)],
                spacing: { after: 200 },
              }),
            );
          }
        } else if (comp.type === "imagetext" && comp.text) {
          children.push(
            new Paragraph({
              children: [new TextRun(comp.text)],
              spacing: { after: 200 },
            }),
          );
        }
      }

      const doc = new Document({
        sections: [
          {
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      saveAs(blob, `${blog.title}.docx`);

      setMenuOpen(false);

      toast.success("Downloaded as DOCX");
    } catch (err) {
      setMenuOpen(false);

      toast.error("Failed to download DOCX");
    }
  };

  const handleReadAloud = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const text = getArticleText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [isReading, getArticleText]);

  // Close speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close share popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    if (shareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);

  // Fallback IDs for semantic headings when not injected in TipTap JSON
  useEffect(() => {
    if (!contentRef.current) return;
    const flatHeadings = getAllHeadingsFlatList(headings);
    let headingIndex = 0;
    contentRef.current
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach((element) => {
        const text = element.textContent?.trim();
        if (!text || headingIndex >= flatHeadings.length) return;
        const heading = flatHeadings[headingIndex];
        if (heading.text === text && !element.id) {
          element.id = heading.id;
          element.setAttribute("data-heading-id", heading.id);
          headingIndex += 1;
        }
      });
  }, [headings, displayComponents]);

  // Track active heading on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const allHeadingIds = getAllHeadingIdsFlat(headings);
    if (allHeadingIds.length === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headingElements = allHeadingIds
            .map((id) => {
              const element = document.getElementById(id);
              return {
                id,
                element,
                top: element ? element.getBoundingClientRect().top : 0,
              };
            })
            .filter((item) => item.element !== null);

          if (headingElements.length === 0) {
            ticking = false;
            return;
          }

          const viewportThreshold = window.innerHeight * 0.3;
          let activeId = headingElements[0].id;

          for (let i = 0; i < headingElements.length; i++) {
            const current = headingElements[i];

            if (current.top <= viewportThreshold) {
              activeId = current.id;

              if (i < headingElements.length - 1) {
                const next = headingElements[i + 1];
                if (next.top > viewportThreshold) {
                  break;
                }
              }
            } else {
              break;
            }
          }

          setActiveHeadingId(activeId);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Multiple checks to ensure DOM is ready
    const timers = [100, 300, 600, 1000].map((delay) =>
      setTimeout(handleScroll, delay),
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [headings]);

  // Auto-scroll table of contents to keep active heading visible
  useEffect(() => {
    if (!activeHeadingId || !tocNavRef.current) return;

    const activeButton = tocNavRef.current.querySelector(
      `button[data-heading-id="${activeHeadingId}"]`,
    ) as HTMLElement;

    if (activeButton) {
      const container = tocNavRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const isAbove = buttonRect.top < containerRect.top;
      const isBelow = buttonRect.bottom > containerRect.bottom;

      if (isAbove || isBelow) {
        const scrollTop =
          activeButton.offsetTop -
          container.clientHeight / 2 +
          activeButton.clientHeight / 2;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [activeHeadingId]);

  // Add highlight effect to clicked heading
  useEffect(() => {
    if (!highlightedHeadingId) return;

    const element = document.getElementById(highlightedHeadingId);
    if (!element) return;

    const originalBackground = element.style.background;
    const originalPosition = element.style.position;
    const originalZIndex = element.style.zIndex;

    element.style.position = "relative";
    element.style.zIndex = "1";

    const textContent = element.textContent || "";
    const words = textContent.trim().split(/\s+/);

    const originalHTML = element.innerHTML;
    element.innerHTML = "";

    const wordElements: { wrapper: HTMLElement; highlight: HTMLElement }[] = [];

    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.textContent = word;
      wordSpan.style.position = "relative";
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "pre";

      const highlight = document.createElement("span");
      highlight.style.position = "absolute";
      highlight.style.left = "-2px";
      highlight.style.right = "-2px";
      highlight.style.bottom = "-2px";
      highlight.style.top = "15%";
      highlight.style.backgroundColor = "#fbbf24";
      highlight.style.opacity = "0.5";
      highlight.style.zIndex = "-1";
      highlight.style.transformOrigin = "left center";
      highlight.style.transform = "scaleX(0)";
      highlight.style.borderRadius = "3px";

      wordSpan.appendChild(highlight);
      element.appendChild(wordSpan);

      wordElements.push({ wrapper: wordSpan, highlight });

      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }

      setTimeout(() => {
        highlight.style.transition =
          "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)";
        requestAnimationFrame(() => {
          highlight.style.transform = "scaleX(1)";
        });
      }, index * 80);
    });

    const fadeOutDelay = words.length * 80 + 1500;
    const fadeOutTimer = setTimeout(() => {
      wordElements.forEach(({ highlight }) => {
        highlight.style.transition = "opacity 800ms ease-out";
        highlight.style.opacity = "0";
      });
    }, fadeOutDelay);

    const cleanupTimer = setTimeout(() => {
      element.innerHTML = originalHTML;
      element.style.background = originalBackground;
      element.style.position = originalPosition;
      element.style.zIndex = originalZIndex;
    }, fadeOutDelay + 1000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(cleanupTimer);
    };
  }, [highlightedHeadingId]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      setActiveHeadingId(id);

      window.scrollTo({ top: y, behavior: "smooth" });

      setHighlightedHeadingId(id);
      setTimeout(() => {
        setHighlightedHeadingId("");
      }, 2500);
    }
  }, []);

  // Render TOC items (h1 only, no hierarchy needed)
  const renderTOCItem = useCallback(
    (heading: Heading) => {
      const isActive = activeHeadingId === heading.id;

      return (
        <li key={heading.id}>
          <button
            onClick={() => scrollToHeading(heading.id)}
            data-heading-id={heading.id}
            className={`
            text-left w-full text-xs transition-all cursor-pointer py-1.5 px-3 rounded
            ${
              isActive
                ? "text-primary font-medium bg-primary/10 border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }
          `}
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {heading.text}
          </button>
        </li>
      );
    },
    [activeHeadingId, scrollToHeading],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr_200px]">
          {/* ── Left Sidebar: Table of Contents ── */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-12">
                <Card
                  className="overflow-hidden"
                  onWheel={(e) => {
                    const target = e.currentTarget.querySelector("nav");
                    if (target) {
                      const { scrollTop, scrollHeight, clientHeight } = target;
                      const isAtTop = scrollTop === 0;
                      const isAtBottom =
                        scrollTop + clientHeight >= scrollHeight - 1;

                      if (
                        (e.deltaY < 0 && isAtTop) ||
                        (e.deltaY > 0 && isAtBottom)
                      ) {
                        return;
                      }
                      e.stopPropagation();
                    }
                  }}
                >
                  <CardHeader className="pb-2 px-4 pt-4">
                    <CardTitle
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      On This Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <nav
                      ref={tocNavRef}
                      className="max-h-[60vh] overflow-y-auto pr-2 toc-scrollbar"
                    >
                      <ul className="space-y-1">
                        {headings.map((heading) => renderTOCItem(heading))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}

          {/* Empty placeholder when no headings to maintain grid */}
          {headings.length === 0 && <aside className="hidden lg:block" />}

          {/* ── Main Content ── */}
          <article className="mx-auto w-full max-w-2xl" ref={contentRef}>
            {/* Breadcrumb */}
            <BlurFade delay={0.04}>
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex items-center gap-1 text-sm text-muted-foreground"
              >
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground"
                >
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="truncate text-foreground font-medium">
                  {blog.title}
                </span>
              </nav>
            </BlurFade>

            {/* Title */}
            <BlurFade delay={0.08}>
              <h1
                className="text-4xl font-bold tracking-tight leading-snug mb-4"
                style={{ fontFamily: "var(--font-js)" }}
              >
                {blog.title}
              </h1>
            </BlurFade>

            {/* Image */}
            {blog.thumbnailKey && (
              <BlurFade delay={0.1}>
                <img
                  src={getImageUrl(blog.thumbnailKey)}
                  alt={blog.title}
                  className="w-full h-auto rounded-lg"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                  loading="eager"
                />
              </BlurFade>
            )}

            {/* Short Description */}
            <BlurFade delay={0.12}>
              <p
                className="text-base leading-relaxed text-muted-foreground mb-5"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {blog.shortDescription}
              </p>
            </BlurFade>

            {/* Meta row */}
            <BlurFade delay={0.16}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                <time dateTime={blog.createdAt}>
                  {formatDate(blog.createdAt)}
                </time>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <>
                    <span>·</span>
                    <span>Updated {formatDate(blog.updatedAt)}</span>
                  </>
                )}
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {readingTime}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-sm px-1.5 py-0 text-[14px] font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </BlurFade>

            {/* Mobile actions row */}
            <div className="flex items-center gap-4 mb-6 lg:hidden">
              {/* Listen */}
              <button
                type="button"
                onClick={handleReadAloud}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs"
              >
                {isReading ? <StopIcon /> : <ReadAloudIcon />}
                {isReading ? "Stop" : "Listen"}
              </button>

              {/* NEW Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs"
                >
                  <IconFileExport size={18} />
                  Export
                </button>

                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-44 rounded-md border bg-background shadow-md z-50">
                    <button
                      onClick={handleCopyMarkdown}
                      className="flex items-center gap-2 w-full text-left font-bold px-3 py-2 text-xs hover:bg-muted"
                    >
                      <IconMarkdown className="size-4 mr-1" />
                      Copy as Markdown
                    </button>

                    <button
                      onClick={handleDownloadDocx}
                      className="flex items-center gap-2 font-bold w-full text-left px-3 py-2 text-xs hover:bg-muted"
                    >
                      <IconFileTypeDocx className="size-4 mr-1" />
                      Download as DOCX
                    </button>

                    <button
                      onClick={handleOpenChatGPT}
                      className="flex items-center gap-2 font-bold w-full text-left px-3 py-2 text-xs hover:bg-muted"
                    >
                      <Bot className="size-4 mr-1" />
                      Open in ChatGPT
                    </button>
                  </div>
                )}
              </div>

              {/* Share buttons */}
              <button onClick={() => handleShare("whatsapp")} className="...">
                <WhatsAppIcon />
              </button>
              <button onClick={() => handleShare("linkedin")} className="...">
                <LinkedInIcon />
              </button>
              <button onClick={() => handleShare("twitter")} className="...">
                <TwitterIcon />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border border mb-8" />

            {/* Content - Render blog components */}
            <BlurFade delay={0.24}>
              <div className="space-y-8 blog-content">
                {displayComponents
                  .sort((a, b) => a.order - b.order)
                  .map((component, index) => {
                    // Richtext component - render Tiptap content as HTML
                    if (component.type === "richtext" && component.content) {
                      try {
                        let html = generateHTML(
                          component.content as Parameters<
                            typeof generateHTML
                          >[0],
                          extensions,
                        );
                        // Add data-heading attributes to headings for table of contents navigation
                        html = addHeadingAttributes(html);
                        return (
                          <div key={component.id || index}>
                            <RichContentRenderer html={html} />
                          </div>
                        );
                      } catch (err) {
                        console.error("Failed to render richtext:", err);
                        return null;
                      }
                    }

                    // Image Text component - image with text, aligned left or right
                    if (component.type === "imagetext") {
                      const isLeftAligned = component.alignment !== "right";
                      return (
                        <div
                          key={component.id || index}
                          className={`flex flex-col ${isLeftAligned ? "md:flex-row" : "md:flex-row-reverse"} gap-6 items-start`}
                        >
                          {component.imageKey && (
                            <div className="w-full md:w-1/2 shrink-0">
                              <img
                                src={getImageUrl(component.imageKey)}
                                alt=""
                                className="w-full h-auto rounded-lg object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          {component.text && (
                            <div className="w-full md:w-1/2">
                              <p
                                className="text-sm leading-7 text-foreground/90"
                                style={{
                                  fontFamily: "var(--font-jetbrains-mono)",
                                }}
                              >
                                {component.text}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Image Uploader component - full width image
                    if (
                      component.type === "imageuploader" &&
                      component.imageKey
                    ) {
                      return (
                        <div key={component.id || index} className="w-full">
                          <img
                            src={getImageUrl(component.imageKey)}
                            alt=""
                            className="w-full h-auto rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>
                      );
                    }

                    // Video Player component
                    if (
                      component.type === "videoplayer" &&
                      component.videoUrl
                    ) {
                      const embedUrl = getVideoEmbedUrl(
                        component.videoUrl,
                        component.videoType,
                      );
                      return (
                        <div
                          key={component.id || index}
                          className="w-full aspect-video"
                        >
                          <iframe
                            src={embedUrl}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Video content"
                          />
                        </div>
                      );
                    }

                    // Code block component
                    if (component.type === "code" && component.content) {
                      const codeContent = component.content as {
                        code?: string;
                        fileName?: string;
                        language?: string;
                        showLineNumbers?: boolean;
                      };
                      if (codeContent.code) {
                        return (
                          <CodeBlockRenderer
                            key={component.id || index}
                            code={codeContent.code}
                            fileName={codeContent.fileName}
                            language={codeContent.language}
                          />
                        );
                      }
                    }

                    // Table component
                    if (component.type === "table" && component.content) {
                      const tableData = component.content as {
                        rows?: string[][];
                        headers?: string[];
                        alignment?: ("left" | "center" | "right")[];
                        bordered?: boolean;
                        striped?: boolean;
                      };
                      if (tableData.rows && tableData.rows.length > 0) {
                        return (
                          <div key={component.id || index} className="w-full">
                            <TableRenderer 
                              data={{
                                rows: tableData.rows,
                                headers: tableData.headers,
                                alignment: tableData.alignment,
                                bordered: tableData.bordered,
                                striped: tableData.striped,
                              }} 
                            />
                          </div>
                        );
                      }
                    }

                    return null;
                  })}
              </div>
            </BlurFade>
            <Separator />

            <AuthorBio
              name="Gyanranjan Priyam"
              initials="GP"
              avatarSrc="/profile/profile.png"
              college="Government College of Engineering Kalahandi, Bhawanipatna"
              tagline="Full Stack Developer"
              bio="Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use."
              github="https://github.com/gyanranjan-priyam"
              linkedin="https://linkedin.com/in/gyanranjan-priyam"
              twitter="https://x.com/gr_priyam"
              articles={6}
              readers="1k"
              yearsActive={1}
              badge="Technical Lead"
            />

            {/* Footer divider + back */}
            <div className="h-px w-full bg-border mt-12 mb-8" />
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <Link
                href="/blog"
                className="transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="truncate text-foreground font-medium">
                {blog.title}
              </span>
            </nav>
          </article>

          {/* ── Right Sidebar: Next Blog + Actions ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-12 space-y-6">
              {/* Next blog card */}
              <div>
                <span
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Next Post
                </span>
                <Link
                  href={`/blog/${nextBlog.slug}`}
                  className="group block rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <h4
                    className="text-sm font-medium leading-snug group-hover:underline line-clamp-3"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {nextBlog.title}
                  </h4>
                  <span
                    className="mt-1.5 block text-[10px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {formatDate(nextBlog.createdAt)}
                  </span>
                </Link>
              </div>

              {/* Read aloud */}
              <div>
                <button
                  type="button"
                  onClick={handleReadAloud}
                  aria-label={isReading ? "Stop reading" : "Read article aloud"}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    isReading
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {isReading ? <StopIcon /> : <ReadAloudIcon />}
                  {isReading ? "Stop" : "Listen"}
                </button>
              </div>

              {/* Share */}
              <div>
                <span
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Share
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare("whatsapp")}
                    aria-label="Share on WhatsApp"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <WhatsAppIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("linkedin")}
                    aria-label="Share on LinkedIn"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <LinkedInIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on Twitter / X"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <TwitterIcon />
                  </button>
                </div>
              </div>

              {/* Export */}
              <div ref={menuRef} className="relative">
                <span
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Export
                </span>

                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="inline-flex w-full items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-foreground cursor-pointer"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Options
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-md border bg-background shadow-md z-50">
                    <button
                      onClick={handleCopyMarkdown}
                      className="w-full flex items-center gap-2 font-bold text-left px-3 py-2 text-xs hover:bg-muted cursor-pointer"
                    >
                      <IconMarkdown className="size-5 mr-1" />
                      Copy as Markdown
                    </button>

                    <button
                      onClick={handleDownloadDocx}
                      className="w-full flex items-center gap-2 font-bold text-left px-3 py-2 text-xs hover:bg-muted cursor-pointer"
                    >
                      <IconFileTypeDocx className="size-5 mr-1" />
                      Download as DOCX
                    </button>

                    <button
                      onClick={handleOpenChatGPT}
                      className="w-full flex items-center gap-2 font-bold text-left px-3 py-2 text-xs hover:bg-muted cursor-pointer"
                    >
                      <Bot className="size-5 mr-1" />
                      Open in ChatGPT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
