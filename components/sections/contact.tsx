import { BlurFade } from "@/components/ui/blur-fade";

export function ContactSection() {
  return (
    <section id="contact" className="py-8">
      <BlurFade delay={0.04} inView>
      <h2 className="mb-4 text-3xl font-bold">Contact</h2>
      </BlurFade>
      <BlurFade delay={0.08} inView>
      <p className="text-sm leading-relaxed text-muted-foreground">
        I&apos;m always open to discussing new opportunities, freelance projects,
        or just having a chat about technology. Reach out to me at{" "}
        <a
          href="mailto:info@priyam.tech"
          className="font-medium text-foreground underline underline-offset-4"
        >
          info@priyam.tech
        </a>{" "}
        and I&apos;ll get back to you as soon as possible.
      </p>
      </BlurFade>
    </section>
  );
}
