import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeSync } from "@/components/theme-sync";
import { LoaderWrapper } from "@/components/loader-wrapper";
import "./globals.css";
import "@/components/loader-component/styles/globals.scss";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";
import localFont from "next/font/local";
import ClickSpark from "@/components/ClickSpark";


const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const mokoto = localFont({
  src: "../public/fonts/mokoto.regular.ttf",
  variable: "--font-mokoto",
});

const gta = localFont({
  src: "../public/fonts/pricedown.otf",
  variable: "--font-gta",
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
            __html: `(function(){if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}if(window.location.pathname==='/'&&!sessionStorage.getItem('loader-intro-shown')){document.documentElement.classList.add('loader-active');}})();`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `html.loader-active main{opacity:0!important;pointer-events:none}`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${mokoto.variable} ${gta.variable} font-sans antialiased`}
      >
        <ThemeSync />
        <SmoothScroll>
          <LoaderWrapper />
          <ClickSpark>
          <main id="layout">
            {children}
            <Separator />
            <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <Footer />
            </div>
          </main>
          </ClickSpark>
        </SmoothScroll>
      </body>
    </html>
  );
}
