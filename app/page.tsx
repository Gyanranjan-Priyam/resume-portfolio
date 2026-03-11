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

const SITE_URL = "https://www.gyanranjanpriyam.tech";
const OG_IMAGE =
  "https://res.cloudinary.com/dw47ib0sh/image/upload/v1766402986/ls67mu0pkqalizjmvuyf.png";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gyanranjan Priyam",
  jobTitle: "Full Stack Developer",
  url: SITE_URL,
  image: OG_IMAGE,
  sameAs: [
    "https://linkedin.com/in/gyanranjan-priyam",
    "https://github.com/Gyanranjan-Priyam",
    "https://instagram.com/gyanranjanpriyam",
  ],
  description:
    "Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.",
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "Three.js",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "Full Stack Development",
    "WebGL",
    "GSAP",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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
