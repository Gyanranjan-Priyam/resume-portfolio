import { Badge } from "@/components/ui/badge";
import { skillCategories } from "@/data/skillCategories";

export function SkillsSection() {
  return (
    <section id="skills" className="py-8">
      <h2 className="mb-6 text-3xl font-bold">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skillCategories.flatMap((cat) =>
          cat.skills.map((skill) => (
            <Badge
              key={skill.name}
              variant="secondary"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
            >
              {skill.icon}
              {skill.name}
            </Badge>
          ))
        )}
      </div>
    </section>
  );
}
