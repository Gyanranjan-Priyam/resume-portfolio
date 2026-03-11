"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight sm:text-8xl" style={{ fontFamily: "var(--font-gta)" }}>
        500
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Something went wrong.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Try Again
      </button>
    </div>
  );
}
