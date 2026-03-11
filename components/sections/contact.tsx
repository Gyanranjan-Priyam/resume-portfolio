export function ContactSection() {
  return (
    <section id="contact" className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Contact</h2>
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
    </section>
  );
}
