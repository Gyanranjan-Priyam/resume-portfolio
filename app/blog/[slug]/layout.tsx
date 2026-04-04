import type { ReactNode } from "react";

export default function BlogDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
