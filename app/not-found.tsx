import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description:
    "The page you're looking for doesn't exist. Let's get you back on track.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight sm:text-8xl" style={{ fontFamily: "var(--font-gta)" }}>
        404
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
