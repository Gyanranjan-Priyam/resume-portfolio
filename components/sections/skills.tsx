import { Badge } from "@/components/ui/badge";
import { skillCategories } from "@/data/skillCategories";
import { BlurFade } from "@/components/ui/blur-fade";

export function SkillsSection() {
  return (
    <section id="skills" className="py-8">
      <BlurFade delay={0.04} inView>
        <h2
          className="mb-6 text-3xl font-bold"
          style={{ fontFamily: "var(--font-ibm)" }}
        >
          Skills
        </h2>
      </BlurFade>
      <div className="flex flex-wrap gap-2">
        {skillCategories.flatMap((cat) =>
          cat.skills.map((skill, i) => (
            <BlurFade key={skill.name} delay={0.04 + i * 0.02} inView>
              <Badge
                key={skill.name}
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {skill.icon}
                {skill.name}
              </Badge>
            </BlurFade>
          )),
        )}
      </div>
    </section>
  );
}
