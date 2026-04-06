import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DeFlatter — See What Your AI Won't Tell You Straight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#ff6b35",
            opacity: 0.08,
            display: "flex",
          }}
        />

        {/* Top section: App name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            DeFlatter
          </div>

          {/* Divider line */}
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: "#ff6b35",
              borderRadius: 2,
              marginBottom: 32,
              display: "flex",
            }}
          />

          {/* Headline */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.3,
              maxWidth: 800,
            }}
          >
            See What Your AI{" "}
            <span style={{ color: "#ff6b35", fontWeight: 800 }}>
              Won&apos;t Tell You
            </span>{" "}
            Straight
          </div>
        </div>

        {/* Bottom section: CTA + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              color: "#555555",
              letterSpacing: "0.08em",
            }}
          >
            TWO AI PERSONAS · ONE EVALUATOR · SYCOPHANCY SCORED
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: "#0a0a0a",
                fontWeight: 700,
                backgroundColor: "#ff6b35",
                padding: "12px 28px",
                borderRadius: 8,
                display: "flex",
              }}
            >
              Try It Free →
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#888888",
                fontWeight: 500,
                display: "flex",
              }}
            >
              deflatter.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
