import { ImageResponse } from "next/og";
import blogs from "@/data/blogsData";

export const runtime = "edge";

export const alt = "Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.id === slug);

  const title = blog?.title || "Blog Post";
  const excerpt = blog?.excerpt ? blog.excerpt.slice(0, 120) + "..." : "";

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
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          }}
        />

        {/* Blog badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            📝 Blog
          </div>
        </div>

        {/* Title */}
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
              fontSize: title.length > 60 ? "42px" : "52px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: "20px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {excerpt}
          </p>
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
                backgroundColor: "#3b82f6",
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
