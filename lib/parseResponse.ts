interface ParsedResponse {
  honest_response: string;
  score: number;
  hidden: string;
  indicators: string[];
}

export function parseCallBResponse(raw: string): ParsedResponse {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  // Level 1: Clean JSON
  try {
    const parsed = JSON.parse(raw);
    if (parsed.honest_response && typeof parsed.score === "number") {
      return { ...parsed, score: clamp(parsed.score) };
    }
  } catch {}

  // Level 2: Strip markdown fences
  try {
    const stripped = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(stripped);
    if (parsed.honest_response && typeof parsed.score === "number") {
      return { ...parsed, score: clamp(parsed.score) };
    }
  } catch {}

  // Level 3: Extract JSON from surrounding text
  try {
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      const parsed = JSON.parse(raw.slice(first, last + 1));
      if (parsed.honest_response && typeof parsed.score === "number") {
        return { ...parsed, score: clamp(parsed.score) };
      }
    }
  } catch {}

  // Level 4: Regex extract individual fields
  try {
    const scoreMatch = raw.match(/"score"\s*:\s*(\d+)/);
    const hiddenMatch = raw.match(/"hidden"\s*:\s*"([^"]+)"/);
    const honestMatch = raw.match(/"honest_response"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const indicatorsMatch = raw.match(/"indicators"\s*:\s*\[((?:[^\]])*)\]/);
    if (honestMatch || scoreMatch) {
      const indicators: string[] = [];
      if (indicatorsMatch) {
        const matches = indicatorsMatch[1].match(/"((?:[^"\\]|\\.)*)"/g);
        if (matches) matches.forEach((m) => indicators.push(m.replace(/^"|"$/g, "")));
      }
      return {
        honest_response: honestMatch ? honestMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : raw,
        score: clamp(scoreMatch ? parseInt(scoreMatch[1], 10) : 50),
        hidden: hiddenMatch ? hiddenMatch[1] : "The response avoided addressing the core question directly.",
        indicators: indicators.length > 0 ? indicators : ["Sycophantic patterns detected in response"],
      };
    }
  } catch {}

  // Level 5: Complete failure
  return {
    honest_response: raw,
    score: 50,
    hidden: "The response avoided being direct about the real issues.",
    indicators: ["Analysis could not be fully parsed — showing raw honest response"],
  };
}
