interface EvaluatorResponse {
  score: number;
  hidden: string;
  indicators: string[];
}

export function parseEvaluatorResponse(raw: string): EvaluatorResponse {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  // Level 1: Clean JSON
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.score === "number") {
      return {
        score: clamp(parsed.score),
        hidden: parsed.hidden || "The response avoided addressing the core concern directly.",
        indicators: Array.isArray(parsed.indicators) ? parsed.indicators.slice(0, 3) : [],
      };
    }
  } catch {}

  // Level 2: Strip markdown fences
  try {
    const stripped = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(stripped);
    if (typeof parsed.score === "number") {
      return {
        score: clamp(parsed.score),
        hidden: parsed.hidden || "The response avoided addressing the core concern directly.",
        indicators: Array.isArray(parsed.indicators) ? parsed.indicators.slice(0, 3) : [],
      };
    }
  } catch {}

  // Level 3: Extract JSON from surrounding text
  try {
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const parsed = JSON.parse(raw.slice(first, last + 1));
      if (typeof parsed.score === "number") {
        return {
          score: clamp(parsed.score),
          hidden: parsed.hidden || "The response avoided addressing the core concern directly.",
          indicators: Array.isArray(parsed.indicators) ? parsed.indicators.slice(0, 3) : [],
        };
      }
    }
  } catch {}

  // Level 4: Regex extract individual fields
  try {
    const scoreMatch = raw.match(/"score"\s*:\s*(\d+)/);
    const hiddenMatch = raw.match(/"hidden"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const indicatorsMatch = raw.match(/"indicators"\s*:\s*\[((?:[^\]])*)\]/);
    if (scoreMatch) {
      const indicators: string[] = [];
      if (indicatorsMatch) {
        const matches = indicatorsMatch[1].match(/"((?:[^"\\]|\\.)*)"/g);
        if (matches) matches.slice(0, 3).forEach((m) => indicators.push(m.replace(/^"|"$/g, "")));
      }
      return {
        score: clamp(parseInt(scoreMatch[1], 10)),
        hidden: hiddenMatch ? hiddenMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "The response avoided addressing the core concern directly.",
        indicators: indicators.length > 0 ? indicators : ["Sycophantic patterns detected in response"],
      };
    }
  } catch {}

  // Level 5: Complete failure
  return {
    score: 50,
    hidden: "The response avoided being direct about the real issues.",
    indicators: ["Analysis could not be fully parsed"],
  };
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .trim();
}
