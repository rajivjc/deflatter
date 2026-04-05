# DeFlatter

**See what your AI isn't telling you.**

DeFlatter sends your question to AI twice — once with standard helpful instructions, once prompted for brutal honesty — then a third prompt evaluates the sycophancy gap. Same model, same question, radically different answers.

**Live:** [deflatter.vercel.app](https://deflatter.vercel.app)

## How it works

```
User's question
       │
       ├──→ Call A: Standard AI prompt ──┐
       │                                 ├──→ Call C: Evaluator compares A + B
       └──→ Call B: Honest AI prompt ────┘         │
                                                   ↓
                                          Score (0-100) + hidden insight
                                          + flattery patterns detected
```

- **Call A + B run in parallel** — neither sees the other's response
- **Call C (evaluator)** scores the gap based on the *severity* of what was softened, not text differences
- All three calls use the same model: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- **No data is stored or logged** — inputs and responses exist only for the duration of the request

## Score interpretation

| Range | Tier | Meaning |
|-------|------|---------|
| 0–19 | Surprisingly Honest | Both responses are equally direct |
| 20–39 | Mildly Flattering | Minor softening, key concerns still raised |
| 40–59 | Typical AI Flattery | Real problems buried under encouragement |
| 60–79 | Heavily Flattering | Dealbreakers reframed as considerations |
| 80–100 | Heavy Sycophancy | Critical risks buried or contradicted |

The score is displayed as a sycophancy dial — a semicircular gauge from "Straight Talk" (left) to "Heavy Flattery" (right).

## Architecture decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Model | Claude Haiku 4.5 | Same model all 3 calls. ~$0.003/query |
| API calls | 3 (A‖B→C) | A+B parallel, C evaluator after both complete |
| Call A | Default prompt, ≤80 words | Conversational, no markdown |
| Call B | Honest prompt, ≤80 words | Independent critic, no reference to A |
| Call C | Evaluator, temp 0.8 | Severity-based scoring, full 0-100 range |
| JSON parser | 5-level fallback | Haiku unreliable at strict JSON |
| Markdown | Strip on display | `stripMarkdown()` safety net |
| Score display | Sycophancy Dial | Semicircular gauge, CNN Fear & Greed style |
| OG image | `next/og` ImageResponse | Auto-generated 1200×630, no external deps |
| Share download | html2canvas | Captures share card as 2× PNG |
| Database | None | No persistence for MVP |
| Auth | None | Frictionless for LinkedIn sharing |
| Tailwind | Removed | Was injecting `100vw` on iOS. App uses inline styles |

## Stack

- Next.js 16, TypeScript, React 19
- Anthropic SDK (`@anthropic-ai/sdk`)
- html2canvas (share card download)
- Vercel (auto-deploy on push to main)

## File structure

```
deflatter/
├── app/
│   ├── layout.tsx             # Root layout, fonts, OpenGraph metadata
│   ├── page.tsx               # Main SPA — input, loading, results screens
│   ├── globals.css            # Pure CSS reset, animations, tap feedback
│   ├── opengraph-image.tsx    # Auto-generated 1200×630 OG preview image
│   ├── error.tsx              # Error boundary
│   └── api/analyze/route.ts   # POST endpoint — parallel A+B, sequential C
├── lib/
│   ├── prompts.ts             # 3 system prompts + evaluator message builder
│   ├── parseResponse.ts       # 5-level JSON parser + stripMarkdown
│   └── rateLimit.ts           # In-memory rate limiter (IP-based)
├── public/
│   └── robots.txt
├── next.config.ts             # Security headers
└── package.json
```

## Setup

```bash
git clone https://github.com/rajivjc/deflatter.git
cd deflatter
npm install
```

Add your API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Run locally:

```bash
npm run dev
```

## Deploy

Push to GitHub → import to Vercel → add `ANTHROPIC_API_KEY` as an environment variable → done.

Auto-deploys on every push to `main`.

## Cost

~$0.003 per query (3 × Claude Haiku calls).

## License

MIT
