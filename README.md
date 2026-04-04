# DeFlatter

DeFlatter sends your question to AI twice — once normally, once honestly — and scores the sycophancy gap.

## Stack

- Next.js 14, TypeScript, Tailwind CSS
- Anthropic SDK (Claude Haiku)

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

Push to GitHub, import to Vercel, add `ANTHROPIC_API_KEY` as an environment variable, done.

## Cost

~$0.004/query on Anthropic Free Tier.

## License

MIT
