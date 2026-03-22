import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contact" className="py-8">
      <BlurFade delay={0.04} inView>
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Contact
        </h2>
      </BlurFade>
      <BlurFade delay={0.08} inView>
        <p
          className="text-sm leading-relaxed text-muted-foreground"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          I&apos;m always open to discussing new opportunities, freelance
          projects, or just having a chat about technology. Reach out to me at{" "}
          <a
            href="mailto:info@priyam.tech"
            className="font-medium text-foreground underline underline-offset-4"
          >
            info@priyam.tech
          </a>{" "}
          or you can contact me through{" "}
          <Link
            href="https://linkedin.com/in/gyanrajanjan-priyam"
            className="font-medium text-foreground underline underline-offset-4"
          >
            LinkedIn
          </Link>
          ,{" "}
          <Link
            href="https://x.com/gr_priyam"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Twitter
          </Link>
          , or{" "}
          <Link
            href="https://github.com/gyanrajanjan-priyam"
            className="font-medium text-foreground underline underline-offset-4"
          >
            GitHub
          </Link>
          . I&apos;ll get back to you as soon as possible.
        </p>
      </BlurFade>
    </section>
  );
}
