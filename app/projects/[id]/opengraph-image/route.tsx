import { ImageResponse } from "next/og";
import projects from "@/data/projectsData";

export const runtime = "edge";

export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  const title = project?.title || "Project";
  const company = project?.company || "";
  const tech = project?.tech?.slice(0, 5) || [];
  const description = project?.desc?.[0] ? project.desc[0].slice(0, 140) + "..." : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)",
          }}
        />

        {/* Project badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#10b981",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            🚀 Project
          </div>
          {company && (
            <span style={{ color: "#71717a", fontSize: "18px" }}>
              {company}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 30 ? "48px" : "56px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              lineHeight: 1.5,
              margin: 0,
              marginBottom: "24px",
            }}
          >
            {description}
          </p>

          {/* Tech stack */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {tech.map((t) => (
              <span
                key={t}
                style={{
                  backgroundColor: "#27272a",
                  color: "#e4e4e7",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #27272a",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              GP
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: 600 }}>
                Gyanranjan Priyam
              </span>
              <span style={{ color: "#71717a", fontSize: "16px" }}>
                Full Stack Developer
              </span>
            </div>
          </div>
          <span style={{ color: "#71717a", fontSize: "18px" }}>
            gyanranjanpriyam.tech
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
