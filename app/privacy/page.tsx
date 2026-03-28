import type { Metadata } from "next";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Cookie, Database, Mail, FileText, Clock, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Gyanranjan Priyam's portfolio website. Learn how your data is collected, used, and protected when you visit priyam.tech.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Gyanranjan Priyam",
    description:
      "Privacy Policy for Gyanranjan Priyam's portfolio website. Learn how your data is collected, used, and protected.",
  },
  twitter: {
    title: "Privacy Policy — Gyanranjan Priyam",
    description:
      "Privacy Policy for Gyanranjan Priyam's portfolio website. Learn how your data is collected, used, and protected.",
  },
};

interface ContentItem {
  subtitle?: string;
  text: string;
}

interface Section {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: ContentItem[];
}

const sections: Section[] = [
  {
    id: "information-collected",
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Information You Provide",
        text: "When you use our contact form or subscribe to our blog, we may collect your name, email address, and any message content you choose to share. This information is provided voluntarily and is used solely to respond to your inquiries.",
      },
      {
        subtitle: "Automatically Collected Information",
        text: "We use analytics services (Ahrefs Analytics) to understand how visitors interact with the website. This may include your IP address, browser type, device information, pages visited, and time spent on pages. This data helps us improve the user experience.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        text: "We use the collected information to respond to your inquiries and messages, improve website functionality and user experience, analyze website traffic and performance, send blog updates if you've subscribed, and ensure the security and integrity of our services.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Local Storage",
    content: [
      {
        subtitle: "Theme Preferences",
        text: "We store your theme preference (light/dark mode) in your browser's local storage to provide a consistent experience across visits. This data never leaves your device.",
      },
      {
        subtitle: "Analytics Cookies",
        text: "Third-party analytics services may use cookies to collect anonymous usage data. These cookies help us understand website performance and visitor behavior without identifying individual users.",
      },
      {
        subtitle: "Session Storage",
        text: "We use session storage to manage the initial loading animation state. This data is automatically cleared when you close your browser tab.",
      },
    ],
  },
  {
    id: "blog-data",
    icon: FileText,
    title: "Blog & Content",
    content: [
      {
        text: "Our blog section displays published articles and their associated metadata including titles, descriptions, tags, and publication dates. If you interact with blog content through comments or reactions (when available), that information may be stored to enhance community features.",
      },
    ],
  },
  {
    id: "data-sharing",
    icon: Shield,
    title: "Data Sharing & Security",
    content: [
      {
        subtitle: "Third-Party Services",
        text: "We may share limited data with trusted third-party services including analytics providers (Ahrefs), hosting providers (Vercel), and email services for contact form functionality. These services are bound by their own privacy policies.",
      },
      {
        subtitle: "Security Measures",
        text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our website is served over HTTPS to ensure secure data transmission.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: Mail,
    title: "Your Rights",
    content: [
      {
        text: "You have the right to access, correct, or delete any personal information we hold about you. You can also opt out of analytics tracking by using browser privacy features or extensions. To exercise any of these rights, please contact us at info@priyam.tech.",
      },
    ],
  },
  {
    id: "updates",
    icon: Clock,
    title: "Policy Updates",
    content: [
      {
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal compliance. Any significant changes will be communicated through the website. We encourage you to review this page periodically.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
          <BlurFade delay={0.04} direction="up">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h1
                className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ fontFamily: "var(--font-ibm)" }}
              >
                Privacy
              </h1>
              <p
              className="font-medium tracking-tight text-muted-foreground"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            </div>
            <div className="ml-4 mt-1 flex shrink-0 items-center gap-2">
              <Link
                href="/"
                aria-label="Home"
                className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Home className="size-4" />
              </Link>
            </div>
          </div>
          </BlurFade>

          <BlurFade delay={0.16} direction="up">
            <p
              className="mt-6 text-[15px] leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Your privacy is important to us. This Privacy Policy explains how we collect, use, 
              and protect your information when you visit{" "}
              <span className="font-medium text-foreground">priyam.tech</span> or <span className="font-medium text-foreground">gyanranjanpriyam.tech</span> and interact with our 
              blog content and services.
            </p>
          </BlurFade>

          {/* Quick Navigation */}
          <BlurFade delay={0.2} direction="up">
            <nav className="mt-8 rounded-lg border bg-card p-4">
              <h2
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Quick Navigation
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      <section.icon className="size-3.5" />
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </BlurFade>

        <Separator />

        {/* Content Sections */}
        <section className="py-8 space-y-10">
          {sections.map((section, sectionIndex) => (
            <BlurFade key={section.id} delay={0.04 + sectionIndex * 0.04} inView>
              <div id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    <section.icon className="size-5 text-foreground" />
                  </div>
                  <h2
                    className="text-2xl font-semibold"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4 pl-0 sm:pl-13">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      {item.subtitle && (
                        <h3
                          className="text-sm font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          {item.subtitle}
                        </h3>
                      )}
                      <p
                        className="text-[14px] leading-relaxed text-muted-foreground"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {sectionIndex < sections.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            </BlurFade>
          ))}
        </section>

        <Separator />

        {/* Contact Section */}
        <section className="py-8">
          <BlurFade delay={0.04} inView>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted shrink-0">
                  <Mail className="size-5 text-foreground" />
                </div>
                <div>
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-ibm)" }}
                  >
                    Questions or Concerns?
                  </h2>
                  <p
                    className="text-[14px] leading-relaxed text-muted-foreground mb-4"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    If you have any questions about this Privacy Policy or wish to exercise your 
                    data rights, feel free to reach out.
                  </p>
                  <a
                    href="mailto:info@priyam.tech"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    <Mail className="size-4" />
                    info@priyam.tech
                  </a>
                </div>
              </div>
            </div>
          </BlurFade>
        </section>

        {/* Footer Note */}
        <BlurFade delay={0.08} inView>
          <div className="pb-8 text-center">
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              This policy applies to{" "}
              <Link href="/" className=" hover:text-foreground transition-colors">
                priyam.tech
              </Link>{" "}
                and{" "}
              <Link href="/" className=" hover:text-foreground transition-colors">
                gyanranjanpriyam.tech
              </Link>{" "}

              and all associated subdomains.
            </p>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}