import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/config";
import projects from "@/data/projectsData";
import templates from "@/data/templateData";
import { experiences } from "@/data/experienceData";
import { education, certifications } from "@/data/educationData";

export const revalidate = 3600;

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: {
      slug: true,
      title: true,
      shortDescription: true,
      tags: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

    const formatDescription = (descriptionParts: string[]) => descriptionParts.join(" ");

  const content = `# Gyanranjan Priyam

> Electrical Engineer by degree, Full-Stack Developer by passion. I build scalable products and mentor the next generation of developers.

- Website: ${SITE_URL}
- Email: info@priyam.tech
- GitHub: https://github.com/gyanranjan-priyam
- LinkedIn: https://linkedin.com/in/gyanranjan-priyam
- Twitter: https://x.com/gr_priyam
- Instagram: https://instagram.com/gyanranjanpriyam
- Resume: https://assets.priyam.tech/resume/resume.pdf

## About

I'm an electrical engineering student at GCE Kalahandi with a passion for technology and web development. Alongside my core studies I am also a software developer focused on building seamless, efficient, and user-centric digital experiences across both front-end and back-end technologies.

Open to internships, freelance projects, and full-time roles. If you're building something meaningful, I'd love to be part of it.

## Hobbies & Interests

- Reading books — expanding imagination, improving thinking, and gaining new perspectives
- Web development — building websites, learning new web technologies, hands-on projects
- Open source contributions — 10+ contributions on Google Gemini CLI project, collaborating with developers globally
- Research — exploring emerging fields and staying updated with advancements

## Work Experience

- Full Stack Developer Intern — building and shipping production features
- (Click any experience on the website for detailed description)
- Full experience list: ${SITE_URL}/#experience

## Education

- B.Tech in Electrical Engineering — Government College of Engineering Kalahandi (GCE Kalahandi)
- Full education details: ${SITE_URL}/#education

## Skills & Stack

- Frontend: React, Next.js, TypeScript, Tailwind CSS, GSAP Animations, Framer Motion
- Backend: Node.js, Prisma, PostgreSQL, REST APIs
- Tools: Git, Vercel, Cloudinary, Prisma ORM
- Other: AI/ML integration, PWA, SEO optimization

## Blog

Technical articles on web development, React, Next.js, TypeScript, and AI/ML — published regularly.

${blogs
  .map(
    (blog: { title: any; slug: any; shortDescription: any; tags: any[]; }) =>
      `- [${blog.title}](${SITE_URL}/blog/${blog.slug}): ${blog.shortDescription} [${blog.tags.join(", ")}]`
  )
  .join("\n")}

## Projects

${projects
  .map((p) => `- [${p.title}](${SITE_URL}/projects/${p.id}): ${formatDescription(p.desc)}`)
  .join("\n")}

## Templates

${templates
  .map((t) => `- [${t.title}](${SITE_URL}/templates/${t.id}): ${formatDescription(t.desc)}`)
  .join("\n")}

## Work Experience

${experiences
  .map((e) => `- **${e.title}** at ${e.company} (${e.period})`)
  .join("\n")}

// Replace the static Education section with:
## Education

${education
  .map((e) => `- **${e.degree}** — ${e.school} (${e.period}) ${e.marks ? `| ${e.marks}` : ""}`)
  .join("\n")}

## Certifications

${certifications
  .map((c) => `- ${c.name} — ${c.issuer} (${c.year})`)
  .join("\n")}

## Pages

- [Home](${SITE_URL}): Portfolio homepage with hero, experience, education, about sections
- [Blog](${SITE_URL}/blog): All technical blog posts
- [Projects](${SITE_URL}/projects): Showcase of built projects
- [Templates](${SITE_URL}/templates): Free developer templates

`.trim();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}