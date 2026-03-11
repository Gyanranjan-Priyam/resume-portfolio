"use client";

import { useCallback, useEffect, useState } from "react";
import { codeToTokens, type BundledLanguage } from "shiki";

function detectLanguage(code: string): { id: BundledLanguage; label: string } {
  if (
    /^["']use client["'];?/.test(code.trim()) ||
    /\bimport\b.*\bfrom\b/.test(code) ||
    /\bexport\s+(default\s+)?(function|async|const)\b/.test(code)
  )
    return { id: "tsx", label: "JAVASCRIPT" };
  if (/\bdef\b|\bimport\b.*\bas\b|\bprint\(/.test(code))
    return { id: "python", label: "PYTHON" };
  if (/\bfn\b|\blet\s+mut\b|\b->\b/.test(code))
    return { id: "rust", label: "RUST" };
  return { id: "tsx", label: "JAVASCRIPT" };
}

type Token = { content: string; color: string | undefined };

export function MonacoCodeBlock({ code }: { code: string }) {
  const [tokens, setTokens] = useState<Token[][] | null>(null);
  const [copied, setCopied] = useState(false);
  const lang = detectLanguage(code);

  useEffect(() => {
    codeToTokens(code, {
      lang: lang.id,
      theme: "github-dark",
    }).then((result) => {
      const mapped = result.tokens.map((line) =>
        line.map((t) => ({
          content: t.content,
          color: t.color,
        }))
      );
      setTokens(mapped);
    });
  }, [code, lang.id]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const lines = code.split("\n");

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-[#0d1117] dark:bg-[#0d1117]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium tracking-wider text-neutral-400">
          {lang.label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-200"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <rect width="14" height="14" x="8" y="8" rx="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto p-4">
        <table className="border-collapse" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, monospace" }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="leading-6">
                <td className="select-none pr-4 text-right text-[13px] text-neutral-600" style={{ minWidth: "2rem" }}>
                  {i + 1}
                </td>
                <td className="text-[13px] whitespace-pre">
                  {tokens && tokens[i]
                    ? tokens[i].map((token, j) => (
                        <span key={j} style={{ color: token.color }}>
                          {token.content}
                        </span>
                      ))
                    : <span className="text-neutral-300">{line}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}
