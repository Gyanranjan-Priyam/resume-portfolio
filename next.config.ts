import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
  redirects: async () => [
    // Home aliases
    { source: "/home", destination: "/", statusCode: 301 },
    { source: "/index", destination: "/", statusCode: 301 },

    // About aliases (about is a section on homepage)
    { source: "/about", destination: "/", statusCode: 301 },
    { source: "/about-me", destination: "/", statusCode: 301 },
    { source: "/me", destination: "/", statusCode: 301 },

    // Projects aliases
    { source: "/project", destination: "/projects", statusCode: 301 },
    { source: "/project/:id", destination: "/projects/:id", statusCode: 301 },
    { source: "/work", destination: "/projects", statusCode: 301 },
    { source: "/portfolio", destination: "/projects", statusCode: 301 },

    // Blog aliases (old /blogs routes → new /blog routes)
    { source: "/blogs", destination: "/blog", statusCode: 301 },
    { source: "/blogs/:slug", destination: "/blog/:slug", statusCode: 301 },
    { source: "/articles", destination: "/blog", statusCode: 301 },
    { source: "/posts", destination: "/blog", statusCode: 301 },

    // Resume / CV
    { source: "/resume", destination: "/resume/resume.pdf", statusCode: 301 },
    { source: "/cv", destination: "/resume/resume.pdf", statusCode: 301 },

    // Contact
    { source: "/contact", destination: "/", statusCode: 301 },
  ],
};

export default nextConfig;
