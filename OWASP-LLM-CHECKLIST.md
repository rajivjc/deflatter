# OWASP Top 10 for LLM Applications (2025) — Checklist

Reference: [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/)

Use this checklist when building any application that sends user input to an LLM API. Each item maps to the OWASP Top 10 for LLM Applications 2025 edition.

---

## LLM01: Prompt Injection

Crafted inputs that override system instructions, extract data, or trigger unintended behavior.

- [ ] Regex pattern detection for common injection phrases (instruction override, role manipulation, delimiter injection)
- [ ] Input wrapping — quote user text so the LLM treats it as data, not instructions
- [ ] Input sanitization — strip HTML tags, control characters, null bytes
- [ ] System prompt hardening — instruct the model to ignore embedded instructions
- [ ] Consider cumulative risk scoring instead of binary block/allow
- [ ] Accept that no defense is 100% — design for graceful failure

**DeFlatter status:** Mitigated (regex detection + input wrapping + sanitization)

---

## LLM02: Sensitive Information Disclosure

LLM outputs may leak PII, credentials, or proprietary data from training data or user inputs.

- [ ] Output PII scanning — regex for SSN, credit card, email, phone, IP patterns
- [ ] Redact or block responses containing sensitive patterns
- [ ] Never include API keys, passwords, or secrets in system prompts
- [ ] Never log full user inputs or LLM responses (or anonymize if you must)
- [ ] Review what the model could reveal about its own configuration
- [ ] Consider output filtering for profanity or harmful content

**DeFlatter status:** Mitigated (output PII redaction, no secrets in prompts, no input logging)

---

## LLM03: Supply Chain

Vulnerabilities in third-party models, dependencies, packages, or training data.

- [ ] Pin exact dependency versions (no ^ or ~ prefixes)
- [ ] Run `npm audit` or equivalent regularly
- [ ] Review lockfile changes before deploys
- [ ] Use trusted, well-maintained packages only
- [ ] Monitor for CVEs in your dependency tree
- [ ] Use a model from a reputable provider with security commitments

**DeFlatter status:** Mitigated (pinned versions, Anthropic as provider)

---

## LLM04: Data and Model Poisoning

Tampered training or fine-tuning data that compromises model behavior.

- [ ] Use models from trusted providers (not community fine-tunes without audit)
- [ ] If fine-tuning: validate and audit training data provenance
- [ ] If using embeddings: validate data sources and update pipelines

**DeFlatter status:** Not applicable (hosted model, no fine-tuning)

---

## LLM05: Improper Output Handling

LLM outputs used without validation, enabling XSS, injection, or code execution.

- [ ] Framework-level output escaping (React auto-escaping, no dangerouslySetInnerHTML)
- [ ] Strip markdown/formatting from LLM output before display
- [ ] Never pass LLM output to `eval()`, `exec()`, SQL queries, or shell commands
- [ ] Sanitize output before storing in databases
- [ ] Run the same security checks on output as you do on input

**DeFlatter status:** Mitigated (React escaping, stripMarkdown, PII redaction on output)

---

## LLM06: Excessive Agency

LLM granted too many tools, permissions, or autonomy to act without human oversight.

- [ ] Principle of least privilege — give the LLM only the tools it needs
- [ ] No function calling or tool use unless required
- [ ] Human-in-the-loop for high-impact actions
- [ ] LLM should act with the user's permissions, not elevated ones
- [ ] Create narrow, single-purpose tool interfaces (not broad internal APIs)

**DeFlatter status:** Not applicable (LLM has zero agency — no tools, no database, no actions)

---

## LLM07: System Prompt Leakage

Extraction of system prompts that reveal business logic, secrets, or security mechanisms.

- [ ] Never put secrets, API keys, or credentials in system prompts
- [ ] Accept that determined users can extract system prompts
- [ ] Instruct the model to refuse system prompt extraction requests
- [ ] Add prompt injection detection for extraction patterns
- [ ] Move sensitive logic to server-side code, not prompts

**DeFlatter status:** Accepted risk (prompts contain no secrets, transparency is on-brand)

---

## LLM08: Vector and Embedding Weaknesses

Vulnerabilities in RAG systems, vector databases, and embedding pipelines.

- [ ] Validate and sanitize documents before embedding
- [ ] Access controls on vector database queries
- [ ] Monitor for embedding poisoning or adversarial vectors
- [ ] Segregate embeddings by tenant/permission level

**DeFlatter status:** Not applicable (no RAG, no vector database)

---

## LLM09: Misinformation

LLM generates confident but false statements that mislead users.

- [ ] Add disclaimers about AI-generated content accuracy
- [ ] Don't present LLM output as authoritative fact
- [ ] Consider output validation against known data sources
- [ ] Frame outputs as opinions/analysis, not truth
- [ ] Provide source attribution where possible

**DeFlatter status:** Partially addressed (disclaimer on score variability, tool is comparative not authoritative)

---

## LLM10: Unbounded Consumption

Resource exhaustion through excessive API calls, large inputs, or denial of service.

- [ ] Per-IP rate limiting
- [ ] Global rate limiting (cost ceiling)
- [ ] max_tokens cap on every API call
- [ ] Input length limits (character/token count)
- [ ] Request body size limit
- [ ] API provider spend limit (hard monthly ceiling)
- [ ] Timeout on API calls (AbortController or equivalent)
- [ ] Stale rate limit entry cleanup (prevent memory leaks)

**DeFlatter status:** Mitigated (IP + global rate limits, max_tokens, input length cap, body size limit, $25/mo ceiling)

---

## Infrastructure & General Security

Not in the OWASP Top 10 but essential for any web app proxying LLM calls.

- [ ] Origin validation — only your frontend can call your API
- [ ] Security headers (CSP, X-Frame-Options, nosniff, referrer policy)
- [ ] API keys in environment variables, never in code
- [ ] .env files gitignored
- [ ] Error messages sanitized — never log full error objects
- [ ] HTTPS enforced (handled by Vercel/hosting provider)
- [ ] Content-Type validation on API requests
- [ ] CORS policy or origin allowlist
- [ ] Persistent rate limiting for production (Redis/KV store)

**DeFlatter status:** Mostly mitigated (origin check, security headers, env vars, error sanitization). Rate limiting is in-memory (documented limitation).

---

## How to Use This Checklist

1. **New project:** Copy this file into your repo. Check items as you implement them.
2. **Audit:** Walk through each section against your codebase. Uncheck anything that regressed.
3. **PR reviews:** Reference specific sections when reviewing security-related changes.
4. **Handover:** Include this in project documentation for the next developer.

## References

- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/)
- [OWASP GenAI Security Project](https://genai.owasp.org/)
- [OWASP Top 10 for LLMs PDF](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)
