# Contributing to DeFlatter

Thanks for your interest. DeFlatter is a small, focused project — contributions that improve the core experience are welcome.

## Setup

```bash
git clone https://github.com/rajivjc/deflatter.git
cd deflatter
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

## Architecture

Read these before making changes:

- **README.md** — How the app works, stack, file structure
- **SECURITY.md** — Threat model, implemented defenses, limitations
- **OWASP-LLM-CHECKLIST.md** — Security checklist for LLM proxy apps
- **CLAUDE.md** — Project conventions for Claude Code sessions

## Guidelines

- **No Tailwind.** The app uses inline styles. This is intentional — see CLAUDE.md.
- **No new dependencies** without discussion. The app is deliberately minimal.
- **Pin exact versions.** No `^` or `~` in package.json.
- **Security first.** Read SECURITY.md before touching the API route. Every user input goes to an LLM — treat it as hostile.
- **Mobile first.** Test on iPhone Safari. The primary audience uses this app on their phone via a LinkedIn link.
- **Keep responses short.** The app's value is the contrast between tabs, not the length of either response.

## Pull Requests

1. One feature per PR
1. Test on mobile before submitting
1. If touching `route.ts` or `prompts.ts`, explain the security implications
1. Update CLAUDE.md if you change conventions or architecture

## Reporting Security Issues

See SECURITY.md for the threat model. If you find a vulnerability, open a GitHub issue or contact the maintainer directly.
