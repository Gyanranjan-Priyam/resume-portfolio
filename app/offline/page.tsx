import type { Metadata } from "next";
import { RetryButton } from "./retry-button";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline. Please check your connection.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-8xl">📡</div>
        <h1 className="font-mono text-4xl font-bold tracking-tight">
          You&apos;re offline
        </h1>
        <p className="text-muted-foreground text-lg">
          It looks like you&apos;ve lost your internet connection. Previously
          visited pages are still available from the cache.
        </p>
        <RetryButton />
      </div>
    </main>
  );
}

