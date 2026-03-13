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
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { PwaRegister } from "@/components/pwa-register";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

const SITE_URL = "https://www.gyanranjanpriyam.tech";
const OG_IMAGE =
  "https://res.cloudinary.com/dw47ib0sh/image/upload/v1766402986/ls67mu0pkqalizjmvuyf.png";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gyanranjan Priyam — Full Stack Developer Portfolio",
    template: "%s — Gyanranjan Priyam",
  },
  description:
    "Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.",
  keywords: [
    "Gyanranjan Priyam",
    "Full Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Frontend Developer",
    "Software Engineer",
    "Portfolio",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "GSAP Animation",
    "Web Applications",
    "Responsive Design",
    "AI/ML",
    "Next.js",
    "React",
    "Node.js",
  ],
  authors: [{ name: "Gyanranjan Priyam", url: SITE_URL }],
  creator: "Gyanranjan Priyam",
  publisher: "Gyanranjan Priyam",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Gyanranjan Priyam",
    title: "Gyanranjan Priyam — Full Stack Developer Portfolio",
    description:
      "Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Gyanranjan Priyam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gyanranjan Priyam — Full Stack Developer Portfolio",
    description:
      "Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.",
    creator: "@gr_priyam",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#333333" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#f0f4f1",
    "geo.region": "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f0f4f1" />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="HFM9ucf4ebY4chd5hRuhqA"
          async
        />
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
        <PwaRegister />
        <ScrollIndicator />
        <SmoothScroll>
          <LoaderWrapper />
          <ClickSpark>
          <main id="layout">
            <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
            </div>
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
