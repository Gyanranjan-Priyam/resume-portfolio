import type { MetadataRoute } from "next";
import blogs from "@/data/blogsData";
import projects from "@/data/projectsData";

const SITE_URL = "https://www.gyanranjanpriyam.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.id}`,
    lastModified: new Date(blog.updatedAt ?? blog.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectEntries = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectEntries,
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
