import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DeFlatter — See what your AI isn't telling you";
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
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#ff6b35",
            opacity: 0.06,
            display: "flex",
          }}
        />

        {/* Dial visualization — simplified arc */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg width="320" height="180" viewBox="0 0 320 180">
            {/* Background arc */}
            <path
              d="M 30 170 A 130 130 0 0 1 290 170"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Green segment */}
            <path
              d="M 30 170 A 130 130 0 0 1 82 62"
              fill="none"
              stroke="#00e676"
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.6"
            />
            {/* Yellow-green segment */}
            <path
              d="M 82 62 A 130 130 0 0 1 160 40"
              fill="none"
              stroke="#7acc29"
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.6"
            />
            {/* Amber segment */}
            <path
              d="M 160 40 A 130 130 0 0 1 238 62"
              fill="none"
              stroke="#e8a317"
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.6"
            />
            {/* Orange segment */}
            <path
              d="M 238 62 A 130 130 0 0 1 275 120"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.6"
            />
            {/* Red segment */}
            <path
              d="M 275 120 A 130 130 0 0 1 290 170"
              fill="none"
              stroke="#ff2d2d"
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.6"
            />
            {/* Needle — pointing to ~65 zone */}
            <line
              x1="160"
              y1="170"
              x2="230"
              y2="75"
              stroke="#ff6b35"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Pivot */}
            <circle cx="160" cy="170" r="6" fill="#ff6b35" />
          </svg>
          {/* Labels under dial */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: 280,
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 13, color: "#555" }}>STRAIGHT TALK</span>
            <span style={{ fontSize: 13, color: "#555" }}>HEAVY FLATTERY</span>
          </div>
        </div>

        {/* Text content — left side */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 550 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            DeFlatter
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#888888",
              lineHeight: 1.4,
              marginBottom: 32,
            }}
          >
            Same question. Two answers.
            <br />
            See what your AI{" "}
            <span style={{ color: "#ff6b35" }}>isn&apos;t telling you</span>.
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#555555",
              letterSpacing: "0.08em",
            }}
          >
            TWO INDEPENDENT PROMPTS · ONE EVALUATOR · SAME MODEL
          </div>
        </div>

        {/* URL bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 18,
            color: "#666666",
            display: "flex",
          }}
        >
          deflatter.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
