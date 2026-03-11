import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeSync } from "@/components/theme-sync";
import "./globals.css";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gyanranjan Priyam — Full-Stack Developer",
  description:
    "Portfolio & resume of Gyanranjan Priyam, a full-stack developer specializing in modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeSync />
        <SmoothScroll>
          {children}
          <Separator />
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
