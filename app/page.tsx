"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Result {
  defaultResponse: string;
  honestResponse: string;
  score: number;
  hidden: string;
  indicators: string[];
}

const CATEGORIES: { label: string; text: string }[] = [
  { label: "Business Idea", text: "I've been working on this for months and think it's really strong: a subscription box for artisan coffee beans targeting busy professionals in Singapore" },
  { label: "Career Move", text: "I'm planning to quit my fintech job to become a full-time content creator on LinkedIn. I think the timing is right given my growing audience" },
  { label: "Strategy", text: "Our go-to-market plan is to offer the product free for 6 months then convert users to paid. I think this is our best path to growth" },
  { label: "Writing", text: "I wrote this LinkedIn post about leadership and I think it's one of my best pieces. Review it: 'True leaders don't create followers. They create more leaders.'" },
];

const LOADING_MESSAGES = [
  "Asking your AI nicely...",
  "Now asking honestly...",
  "Measuring the flattery...",
  "Calculating the sycophancy gap...",
  "Removing the sugar coating...",
];

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Pure Sycophancy", color: "#ff2d2d" };
  if (score >= 60) return { label: "Heavily Flattering", color: "#ff6b35" };
  if (score >= 40) return { label: "Typical AI Flattery", color: "#e8a317" };
  if (score >= 20) return { label: "Mildly Flattering", color: "#7acc29" };
  return { label: "Surprisingly Honest", color: "#00e676" };
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (score / 100) * circumference;
    requestAnimationFrame(() => setOffset(targetOffset));

    const start = performance.now();
    const duration = 1400;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(eased * score));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score, circumference]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div style={{ marginTop: -95, textAlign: "center" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color }}>{displayScore}</span>
        <div style={{ fontSize: 11, color: "#888" }}>/100</div>
      </div>
      <div style={{ height: 45 }} />
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"input" | "loading" | "results">("input");
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [activeTab, setActiveTab] = useState<"honest" | "default">("honest");
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (screen !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [screen]);

  const handleSubmit = useCallback(async () => {
    if (input.trim().length < 10) return;
    setError(null);
    setScreen("loading");
    setLoadingMsg(0);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setScreen("input");
        return;
      }
      setResult(data);
      setActiveTab("honest");
      setScreen("results");
    } catch {
      setError("Network error. Please try again.");
      setScreen("input");
    }
  }, [input]);

  const handleReset = () => {
    setScreen("input");
    setInput("");
    setActiveCategory(null);
    setResult(null);
    setError(null);
    setCopied(false);
  };

  const tier = result ? getScoreTier(result.score) : { label: "", color: "#fff" };

  // INPUT SCREEN
  if (screen === "input") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px 40px", maxWidth: "100vw", overflowX: "hidden" as const }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 12 }}>DeFlatter</h1>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
              Same question. Two answers.<br />
              See what your AI <span style={{ color: "#ff6b35" }}>isn&apos;t telling you</span>.
            </p>
          </div>

          {/* Category Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(cat.label);
                  setInput(cat.text);
                  setError(null);
                  textareaRef.current?.focus();
                }}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  padding: "6px 12px",
                  background: activeCategory === cat.label ? "#1c1c1c" : "transparent",
                  border: `1px solid ${activeCategory === cat.label ? "rgba(255,107,53,0.25)" : "#333"}`,
                  color: activeCategory === cat.label ? "#ff6b35" : "#aaa",
                  cursor: "pointer",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={4}
            maxLength={300}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); if (activeCategory && !CATEGORIES.find(c => c.text === e.target.value)) setActiveCategory(null); }}
            placeholder="I think my startup idea for AI-powered invoicing is really strong — evaluate it"
            style={{
              width: "100%",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 14,
              padding: "14px 16px",
              background: "#111111",
              border: "1px solid #333",
              color: "#e0e0e0",
              resize: "none",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />

          {/* Error */}
          {error && (
            <div style={{ fontSize: 12, color: "#ff2d2d", background: "rgba(255,45,45,0.06)", border: "1px solid rgba(255,45,45,0.12)", padding: "8px 12px", marginTop: 8 }}>
              {error}
            </div>
          )}

          {/* Row below textarea */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: input.length > 280 ? "#ff6b35" : "#777" }}>
              {input.length}/300
            </span>
            <button
              disabled={input.trim().length < 10}
              onClick={handleSubmit}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "10px 24px",
                background: input.trim().length >= 10 ? "#ff6b35" : "#1a1a1a",
                color: input.trim().length >= 10 ? "#000" : "#666",
                border: "none",
                cursor: input.trim().length >= 10 ? "pointer" : "default",
                letterSpacing: "0.02em",
              }}
            >
              DEFLATTER IT
            </button>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #2a2a2a", marginTop: 44, marginBottom: 36 }} />

          {/* Three-step explainer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { num: "01", text: "Your question goes to a standard AI" },
              { num: "02", text: "Same question goes to an AI prompted for honesty" },
              { num: "03", text: "We measure the gap between them" },
            ].map((step) => (
              <div key={step.num} style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "rgba(255,107,53,0.3)", fontSize: 15 }}>{step.num}</span>
                <span style={{ fontSize: 13, color: "#999", minWidth: 0 }}>{step.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (screen === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, maxWidth: "100vw", overflowX: "hidden" as const }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                background: "#ff6b35",
                animation: `pulse3 1.2s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
        <p key={loadingMsg} style={{ fontSize: 14, color: "#888", fontStyle: "italic", animation: "fadeUp 0.4s ease" }}>
          {LOADING_MESSAGES[loadingMsg]}
        </p>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results" && result) {
    const shareText = `I asked AI to evaluate my idea.\nThen I asked again — honestly.\n\nSycophancy Score: ${result.score}/100 (${tier.label})\n\nWhat my AI hid from me:\n"${result.hidden}"\n\nTry it yourself → deflatter.vercel.app`;
    const shareUrl = "https://deflatter.vercel.app";

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px 40px", maxWidth: "100vw", overflowX: "hidden" as const }}>
        <div style={{ width: "100%", maxWidth: 640 }}>

          {/* Beat 1 — Score Ring */}
          <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0s", textAlign: "center", marginBottom: 32 }}>
            <ScoreRing score={result.score} color={tier.color} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: tier.color, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
              {tier.label}
            </div>
          </div>

          {/* Beat 2 — What your AI hid */}
          <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.2s", borderLeft: `3px solid ${tier.color}`, background: "#111111", padding: "14px 18px", marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: tier.color, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 8 }}>
              What your AI hid from you
            </div>
            <div style={{ fontSize: 15, color: "#ddd", fontStyle: "italic", wordBreak: "break-word" as const }}>
              &ldquo;{result.hidden}&rdquo;
            </div>
          </div>

          {/* Beat 3 — Tabbed comparison */}
          <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.35s", marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
              <button
                onClick={() => setActiveTab("honest")}
                style={{
                  flex: 1,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "10px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === "honest" ? "#00e676" : "transparent"}`,
                  color: activeTab === "honest" ? "#00e676" : "#888",
                  cursor: "pointer",
                }}
              >
                What you needed to hear
              </button>
              <button
                onClick={() => setActiveTab("default")}
                style={{
                  flex: 1,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "10px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === "default" ? "#ff6b35" : "transparent"}`,
                  color: activeTab === "default" ? "#ff6b35" : "#888",
                  cursor: "pointer",
                }}
              >
                What your AI said
              </button>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-line", color: activeTab === "honest" ? "#ccc" : "#aaa", wordBreak: "break-word" as const }}>
              {activeTab === "honest" ? result.honestResponse : result.defaultResponse}
            </div>
          </div>

          {/* Beat 4 — Sycophancy Patterns */}
          <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.5s", marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 14 }}>
              Sycophancy Patterns Detected
            </div>
            {result.indicators.map((ind, i) => (
              <div key={i} style={{ fontSize: 13, color: "#999", borderLeft: "1px solid #444", paddingLeft: 14, marginBottom: 10, wordBreak: "break-word" as const, minWidth: 0 }}>
                {ind}
              </div>
            ))}
          </div>

          {/* Beat 5 — Share section */}
          <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.6s" }}>
            {/* Share Card */}
            <div style={{
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(135deg, #0c0c0c, ${tier.color}08)`,
              border: `1px solid ${tier.color}25`,
              padding: "28px 24px",
              marginBottom: 12,
            }}>
              {/* Accent circle */}
              <div style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: tier.color,
                opacity: 0.06,
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 24 }}>DeFlatter</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, color: tier.color, lineHeight: 1 }}>{result.score}</span>
                  <span style={{ fontSize: 17, color: "#888" }}>/100</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: tier.color, textTransform: "uppercase", marginBottom: 20 }}>{tier.label}</div>
                {/* Progress bar */}
                <div style={{ height: 3, background: "#2a2a2a", marginBottom: 20 }}>
                  <div style={{ height: 3, width: `${result.score}%`, background: `linear-gradient(90deg, transparent, ${tier.color})` }} />
                </div>
                {/* Hidden callout */}
                <div style={{ borderLeft: `2px solid ${tier.color}99`, paddingLeft: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", marginBottom: 4 }}>What your AI hid from you</div>
                  <div style={{ fontSize: 14, color: "#aaa", fontStyle: "italic", wordBreak: "break-word" as const }}>&ldquo;{result.hidden}&rdquo;</div>
                </div>
                <div style={{ fontSize: 12, color: "#777" }}>deflatter.vercel.app</div>
              </div>
            </div>

            {/* Share actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {/* Primary row: LinkedIn + Download */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
                  style={{
                    flex: 1,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "14px 16px",
                    background: "#0A66C2",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => {
                    // TODO: html2canvas download — for now, prompt user to screenshot
                    alert("Screenshot the card above to save as image. Auto-download coming soon.");
                  }}
                  style={{
                    width: 52,
                    padding: "14px 0",
                    background: "transparent",
                    border: "1px solid #444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Download card as image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="square"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>
                </button>
              </div>

              {/* Secondary row: Copy text + Share on X */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  style={{
                    flex: 1,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    padding: "12px 16px",
                    background: "transparent",
                    border: `1px solid ${copied ? "rgba(0,230,118,0.25)" : "#444"}`,
                    color: copied ? "#00e676" : "#888",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="8" y="8" width="13" height="13"/><path d="M4 16V4h12"/></svg>
                  {copied ? "Copied!" : "Copy text"}
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")}
                  style={{
                    flex: 1,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    padding: "12px 16px",
                    background: "#000",
                    border: "1px solid #333",
                    color: "#e0e0e0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Share on X
                </button>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                textTransform: "uppercase",
                padding: "12px",
                background: "transparent",
                border: "1px solid rgba(255,107,53,0.19)",
                color: "#ff6b35",
                cursor: "pointer",
                marginTop: 16,
              }}
            >
              DEFLATTER ANOTHER
            </button>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  return null;
}

function Footer() {
  return (
    <div style={{ marginTop: 60, paddingTop: 20, borderTop: "1px solid #2a2a2a", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#777" }}>
        Both responses use the same model · Same question, different prompt
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        <a href="https://www.linkedin.com/in/rajivjacobcheriyan/" target="_blank" rel="noopener noreferrer" style={{ color: "#999", borderBottom: "1px solid #444", textDecoration: "none" }}>
          Rajiv Cheriyan
        </a>
      </div>
    </div>
  );
}
