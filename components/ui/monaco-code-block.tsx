"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MonacoCodeBlockProps {
  code: string;
  fileName?: string;
  language?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JAVASCRIPT",
  typescript: "TYPESCRIPT",
  tsx: "TSX",
  jsx: "JSX",
  python: "PYTHON",
  java: "JAVA",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  php: "PHP",
  ruby: "RUBY",
  go: "GO",
  rust: "RUST",
  swift: "SWIFT",
  kotlin: "KOTLIN",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  markdown: "MARKDOWN",
  bash: "BASH",
  shell: "SHELL",
  plaintext: "PLAIN TEXT",
};

// Map our language codes to Prism language codes
const PRISM_LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  html: "markup",
  css: "css",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  bash: "bash",
  shell: "bash",
  plaintext: "text",
};

function detectLanguage(code: string): string {
  if (
    /^["']use client["'];?/.test(code.trim()) ||
    /\bimport\b.*\bfrom\b/.test(code) ||
    /\bexport\s+(default\s+)?(function|async|const)\b/.test(code)
  )
    return "typescript";
  if (/\bdef\b|\bimport\b.*\bas\b|\bprint\(/.test(code))
    return "python";
  if (/\bfn\b|\blet\s+mut\b|\b->\b/.test(code))
    return "rust";
  if (/\bfunc\b.*\{|\bpackage\s+main\b/.test(code))
    return "go";
  return "javascript";
}

export function MonacoCodeBlock({ code, fileName, language }: MonacoCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No code available
      </div>
    );
  }

  // Use provided language or detect from code
  const detectedLang = language?.toLowerCase() || detectLanguage(code);
  const prismLanguage = PRISM_LANGUAGE_MAP[detectedLang] || "text";
  const languageLabel = LANGUAGE_LABELS[detectedLang] || detectedLang.toUpperCase();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build header label: "LANGUAGE · filename" or just "LANGUAGE"
  const headerLabel = fileName ? `${languageLabel} · ${fileName}` : languageLabel;

  return (
    <div className={cn("monaco-code-block my-4 rounded-lg overflow-hidden border border-border bg-[#0d1117]")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          {headerLabel}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code Block with Syntax Highlighting */}
      <div className="relative overflow-x-auto">
        <SyntaxHighlighter
          language={prismLanguage}
          style={oneDark}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: "#0d1117",
            fontSize: "0.8125rem",
            lineHeight: "1.5rem",
            padding: "1rem",
          }}
          lineNumberStyle={{
            minWidth: "2.5rem",
            paddingRight: "1rem",
            color: "#6e7681",
            textAlign: "right",
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
