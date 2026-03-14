"use client";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-foreground text-background hover:opacity-80 rounded-md px-6 py-2.5 text-sm font-medium transition-opacity"
      style={{ fontFamily: "var(--font-ibm)" }}
    >
      Try again
    </button>
  );
}
