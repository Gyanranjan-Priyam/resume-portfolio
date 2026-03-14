import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { education, certifications } from "@/data/educationData";
import { BlurFade } from "@/components/ui/blur-fade";

export function EducationSection() {
  return (
    <section id="education" className="py-8">
      <BlurFade delay={0.04} inView>
        <h2
          className="mb-6 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Education
        </h2>
      </BlurFade>
      <div className="space-y-6">
        {education.map((edu, i) => (
          <BlurFade key={i} delay={0.04 + i * 0.05} inView>
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border bg-white p-1.5">
                <AvatarImage
                  src={edu.logo}
                  alt={edu.school}
                  className="object-contain"
                />
                <AvatarFallback className="text-xs font-bold">
                  {edu.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[15px] font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {edu.school}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {edu.degree}
                </p>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {edu.marks}
                </p>
              </div>
              <span
                className="shrink-0 text-sm text-muted-foreground text-right"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {edu.period}
              </span>
            </div>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.04} inView>
        <h2
          className="mb-6 mt-12 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Certifications
        </h2>
      </BlurFade>
      <div className="space-y-4">
        {certifications.map((cert, i) => (
          <BlurFade key={i} delay={0.04 + i * 0.05} inView>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {cert.name}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {cert.issuer}
                </p>
              </div>
              <span
                className="shrink-0 text-sm text-muted-foreground"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {cert.year}
              </span>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
