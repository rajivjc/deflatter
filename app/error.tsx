"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", overflow: "hidden" as const }}>
      <div style={{ padding: 20, boxSizing: "border-box" as const, maxWidth: 640, width: "100%", textAlign: "center" as const }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Something broke.</h2>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "#888", marginBottom: 24 }}>The AI might be resting — try again in a moment.</p>
        <button onClick={reset} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "10px 24px", background: "transparent", border: "1px solid #ff6b3530", color: "#ff6b35", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Try again
        </button>
      </div>
    </div>
  );
}
