"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
            500
          </h1>
          <p className="mt-4 text-lg opacity-70">
            A critical error occurred.
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
