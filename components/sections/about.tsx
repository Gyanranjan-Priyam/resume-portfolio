import { Tooltip } from "@/components/ui/tooltip";
import { BlurFade } from "@/components/ui/blur-fade";

export function AboutSection() {
  return (
    <section id="about" className="py-8">
      <BlurFade delay={0.04} inView>
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          About
        </h2>
      </BlurFade>
      <BlurFade delay={0.08} inView>
        <p
          className="text-[15px] leading-relaxed text-muted-foreground"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          I&apos;m an electrical engineering student with a passion for
          technology and web development. Alongside my core studies I am also a
          software developer focused on building seamless, efficient, and
          user-centric digital experiences across both front-end and back-end
          technologies.
        </p>
      </BlurFade>

      <BlurFade delay={0.12} inView>
        <h2
          className="mt-4 mb-2 text-2xl font-semibold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Hobbies &amp; Interests
        </h2>
      </BlurFade>
      <BlurFade delay={0.16} inView>
        <p
          className="text-[15px] leading-relaxed text-muted-foreground"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          My hobbies include{" "}
          <Tooltip content="I enjoy reading a wide range of books that help me expand my imagination, improve my thinking, and gain new perspectives.">
            <span className="font-semibold text-foreground cursor-pointer">
              reading books
            </span>
          </Tooltip>{" "}
          ,{" "}
          <Tooltip content="I love building websites, learning new web technologies, and improving my skills through hands-on projects.">
            <span className="font-semibold text-foreground cursor-pointer">
              web development
            </span>
          </Tooltip>
          , and{" "}
          <Tooltip content="I actively contribute to open source projects, collaborating with other developers to improve software and share knowledge. Currently I have 10+ contributions on Google Gemini CLI project.">
            <span className="font-semibold text-foreground cursor-pointer">
              open source contributions
            </span>
          </Tooltip>
          . I also have a strong interest in{" "}
          <Tooltip content="I am passionate about exploring new topics, learning about emerging fields, and conducting research to expand my understanding.">
            <span className="font-semibold text-foreground cursor-pointer">
              research
            </span>
          </Tooltip>{" "}
          across various fields, which helps me stay updated with advancements
          and continuously gain knowledge.
        </p>
      </BlurFade>
    </section>
  );
}
