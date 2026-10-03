# Alejos Towing website: tools record

Last updated 2026-10-03. Costs are in USD and were checked from general knowledge, not from live price pages; I re-check each one before anything is bought.

## 1. Development tools (installed and tested in Claude's build environment)

These live only in the development environment. None of them is shipped to website visitors. All free.

| Tool | Purpose | Status |
|---|---|---|
| Node 22, npm, Python 3, git | Build scripts, version control | Pre-installed, working |
| Playwright 1.56 + Chromium | Drives a real browser: screenshots at phone (390px), tablet (820px) and desktop (1440px), touch and keyboard tests, the full request-a-tow journey | Installed, tested |
| axe-core (@axe-core/playwright) | Automated WCAG accessibility checks, including color contrast | Installed, tested: 0 violations across all 3 directions |
| Lighthouse | Performance, accessibility, SEO and best-practice scores on a throttled mobile profile | Installed, tested (preview: perf 89, a11y 100, best practices 96, SEO 90) |
| sharp | Image resizing, cropping, AVIF/WebP conversion for photos | Installed, tested on screenshots |
| html-validate | HTML correctness checks | Installed, not yet run |
| Design skills in this environment (accessibility review, design critique, design system, UX copy, SEO audit) | Structured review passes | Available, used as checklists |

Planned for the real site build (free, installed once the repository exists): **Astro** static site framework (fast pages, no visitor-side framework weight), self-hosted fonts via **Fontsource**, **Lucide** icons (only the icons used are shipped).

## 2. Integrations (need an account, permission, or money)

| Service | Purpose | Cost | Status |
|---|---|---|---|
| GitHub repository | Version history, backups, deploys | Free | **Waiting on Yordan** to create an empty repo |
| Cloudflare Pages (recommended host) | Hosting, HTTPS, global CDN, preview links per change | Free tier | Needs Yordan's free Cloudflare account |
| Domain name | e.g. alejostowing.com | About $10–15 per year | Not bought. Needs Yordan's decision |
| Quote form delivery | Send requests to an email inbox | Free tiers exist (e.g. Resend about 3,000 emails/month, Web3Forms) | Not set up. Needs the destination email |
| Text-message alerts for new requests (optional) | Dispatcher's phone gets a text for each request | Twilio: roughly $1–2/month for a number plus about 1¢ per text | Not set up. Only if Yordan wants it |
| Cloudflare Web Analytics | Visitor counts, no cookies, no banner needed | Free | Not set up |
| Google Business Profile + Search Console | Shows up on Google Maps and search, reviews | Free | Needs Yordan's Google account |
| Map | Service-area map | Free with OpenStreetMap/MapLibre; Google Maps API needs a billing account | Not chosen yet |

**Connectors that failed to connect in this environment** (so not usable yet): Figma, Canva, Notion, Slack and several others returned a network-policy error. None is required; Figma or Canva would only matter if Yordan has brand files there.

## 3. Generated artifacts

| Artifact | Where |
|---|---|
| Homepage preview with 3 visual directions | https://claude.ai/artifact/CkV5aZ9LEXGV7aa7288KTg · source `website/preview/alejos-preview.html` |
| Test scripts (screenshots, accessibility, customer journey) | `website/preview/*.mjs` |
| Screenshots | `website/screenshots/` |

## Credentials rule

API keys and passwords go in the hosting provider's encrypted environment settings, never in the repository or the website's public files.
