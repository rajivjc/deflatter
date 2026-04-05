import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT_DEFAULT, SYSTEM_PROMPT_HONEST, SYSTEM_PROMPT_EVALUATOR, buildEvaluatorMessage } from "@/lib/prompts";
import { parseEvaluatorResponse } from "@/lib/parseResponse";
import { checkRateLimit } from "@/lib/rateLimit";

const MODEL = "claude-haiku-4-5-20251001";

const INPUT_BLOCKLIST = [
  "ignore all instructions",
  "system prompt",
  "you are now",
  "disregard previous",
  "ignore previous",
];

function sanitize(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPrompt = body.prompt;

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return NextResponse.json({ error: "No prompt provided." }, { status: 400 });
    }

    const prompt = sanitize(rawPrompt);

    if (prompt.length < 10) {
      return NextResponse.json({ error: "Too short — give the AI something to work with (10+ chars)." }, { status: 400 });
    }
    if (prompt.length > 300) {
      return NextResponse.json({ error: "Keep it under 300 characters." }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    for (const blocked of INPUT_BLOCKLIST) {
      if (lower.includes(blocked)) {
        return NextResponse.json({ error: "Nice try." }, { status: 400 });
      }
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }

    const anthropic = new Anthropic();

    // Call A + B in parallel — independent, neither sees the other
    const [callA, callB] = await Promise.all([
      anthropic.messages.create({
        model: MODEL,
        max_tokens: 120,
        system: SYSTEM_PROMPT_DEFAULT,
        messages: [{ role: "user", content: prompt }],
      }),
      anthropic.messages.create({
        model: MODEL,
        max_tokens: 120,
        system: SYSTEM_PROMPT_HONEST,
        messages: [{ role: "user", content: prompt }],
      }),
    ]);

    const defaultResponse = callA.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const honestResponse = callB.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");

    // Call C — evaluator compares both responses
    const callC = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      temperature: 0.8,
      system: SYSTEM_PROMPT_EVALUATOR,
      messages: [{ role: "user", content: buildEvaluatorMessage(prompt, defaultResponse, honestResponse) }],
    });
    const callCRaw = callC.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const parsed = parseEvaluatorResponse(callCRaw);

    // Strip any internal architecture language that leaked into the hidden field
    // Strip any internal language that leaked, then enforce single-sentence limit
    let sanitizedHidden = parsed.hidden
      .replace(/\b(Response [AB]|the standard response|the honest response|the AI)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    // If it somehow starts with a lowercase letter after stripping, capitalize
    if (sanitizedHidden.length > 0) {
      sanitizedHidden = sanitizedHidden.charAt(0).toUpperCase() + sanitizedHidden.slice(1);
    }
    // Enforce single sentence — take only up to the first period
    const firstPeriod = sanitizedHidden.indexOf(".");
    if (firstPeriod > 0 && firstPeriod < sanitizedHidden.length - 1) {
      sanitizedHidden = sanitizedHidden.substring(0, firstPeriod + 1);
    }

    return NextResponse.json({
      defaultResponse,
      honestResponse,
      score: parsed.score,
      hidden: sanitizedHidden,
      indicators: parsed.indicators,
    });
  } catch (error) {
    console.error("DeFlatter API error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
