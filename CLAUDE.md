# DeFlatter — Claude Code Project Context

Read this file at the start of every session. It contains the conventions and architecture decisions that govern this codebase.

## What This App Does

DeFlatter sends a user's question to two independent Claude Haiku prompts (one default, one honest), then a third evaluator prompt scores the sycophancy gap. It's a single-page app designed for LinkedIn sharing.

## Stack

- Next.js 16, TypeScript, React 19
- Anthropic SDK (Claude Haiku 4.5) — 3 API calls per request
- html2canvas for share card download
- Deployed on Vercel (auto-deploy on push to main)
- No database, no auth, no Tailwind

## Critical Conventions

### Styling
- **ALL styles are inline.** No Tailwind, no CSS modules, no styled-components.
- Tailwind was deliberately removed in Session 3 — it injected `100vw` on iOS causing horizontal overflow.
- `globals.css` contains only the CSS reset, animations, and tap feedback. No component styles.

### Fonts
- **IBM Plex Mono** — all app chrome (chips, buttons, counter, footer, share panel)
- **IBM Plex Sans** — textarea only (user input is natural language, not code)
- **Syne** — display headings, score numbers, tier labels

### Colors
- Background: `#0a0a0a`
- Brand orange: `#ff6b35`
- Tier colors: `#00e676` (honest) → `#7acc29` → `#e8a317` → `#ff6b35` → `#ff2d2d` (sycophantic)

### Architecture
- `app/page.tsx` — single SPA with 3 screen states: `input`, `loading`, `results`
- `app/api/analyze/route.ts` — POST endpoint, 3 Haiku calls (A‖B→C)
- `lib/prompts.ts` — 3 system prompts + evaluator message builder
- `lib/parseResponse.ts` — 5-level JSON fallback parser + stripMarkdown
- `lib/rateLimit.ts` — IP + global rate limiting (in-memory)
- `app/opengraph-image.tsx` — auto-generated 1200×630 OG image

### Security
- Origin validation on API endpoint
- Prompt injection detection (regex patterns) + input wrapping
- Output PII redaction on all LLM responses
- Error logging sanitized (message only, never full objects)
- Request body size limit (10KB)
- See SECURITY.md for full threat model

### Dependencies
- **Pin exact versions.** No `^` or `~` in package.json.
- Run `npm audit` before adding any new package.

### Mobile
- Primary test device: iPhone Safari
- Viewport must fit without scrolling on input screen (~660px)
- Textarea font size must be ≥16px (iOS auto-zoom threshold)
- All buttons need `-webkit-tap-highlight-color: transparent` and `:active` opacity

### Prompts
- Call A (default): ≤80 words, conversational, no markdown
- Call B (honest): ≤80 words, blunt critic, no markdown
- Call C (evaluator): severity-based scoring (0-100), standalone hidden field, max 3 indicators
- max_tokens: 120 for A+B, 300 for C
- temperature: 0.8 on evaluator only

## Session Handover Pattern

At the end of each session, create a handover document that includes:
1. What was shipped (with commit hashes)
2. What was verified vs. needs testing
3. Current code state (file structure, key decisions)
4. Remaining work (prioritized)

## Files to Never Modify Without Good Reason

- `globals.css` — CSS reset only, no component styles
- `next.config.ts` — security headers + CSP
- `lib/rateLimit.ts` — rate limiting logic
- `SECURITY.md` — threat model (update, don't delete)

## References

- Live: https://deflatter.vercel.app
- Repo: https://github.com/rajivjc/deflatter
- OG image test: https://deflatter.vercel.app/opengraph-image
