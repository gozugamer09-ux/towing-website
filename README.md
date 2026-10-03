# Alejos Towing website

Source for the Alejos Towing website: design, content, tests and maintenance docs.

| Path | What it is |
|---|---|
| `content/business.json` | Single source of truth for business facts. Only `confirmed: true` values may go live. |
| `design/preview/` | Design-direction preview (three switchable directions). |
| `tests/` | Playwright screenshots, axe accessibility checks, customer-journey test. |
| `docs/AGENT-WORKFLOW.md` | How tasks are received, tested, published, reported and rolled back (built for a future Friday connection). |
| `TOOLS.md` | Tools, integrations and costs. |

Status: design direction under review. The production site (Astro, hosted on Cloudflare Pages) will be added here once the direction is chosen.

Run tests: `npm install`, then `npm run test:journey` / `npm run test:visual`.
