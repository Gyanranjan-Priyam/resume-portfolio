import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { BlogsSection } from "@/components/sections/blogs";
import { EducationSection } from "@/components/sections/education";
import { ContactSection } from "@/components/sections/contact";
import { GitHubCalendarSection } from "@/components/sections/github-calendar";
import { Separator } from "@/components/ui/separator";
import { ExperienceSection } from "@/components/sections/experience";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <HeroSection />
        <Separator />
        <AboutSection />
        <Separator />
        <EducationSection />
        <Separator />
        <ExperienceSection />
        <Separator />
        <SkillsSection />
        <GitHubCalendarSection />
        <Separator />
        <ProjectsSection />
        <Separator />
        <BlogsSection />
        <Separator />
        <ContactSection />
      </div>
    </div>
  );
}
