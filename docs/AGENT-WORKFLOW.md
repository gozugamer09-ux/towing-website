# Website agent workflow (built for a future Friday connection)

Any agent or person changing the site follows the same loop, so Friday can later send tasks and receive results without a new process.

## 1. Task in
A task is one clear outcome, written as:
- **Goal:** what should be true afterwards (e.g. "Add winch-out to services").
- **Facts supplied:** any new business information, with who confirmed it.
- **Limits:** may it publish directly, or stop at a preview for approval?

## 2. Information
- Business facts: `content/business.json` (only `confirmed: true` values may appear on the live site).
- Design rules: `docs/DESIGN.md`.
- Page text that isn't a business fact: `content/services.json`, `content/faq.json`, `content/reviews.json` (each with its Spanish in `"es"`), and the page views in `src/views/`, which hold each page's English and Spanish wording side by side. `src/pages/` only maps addresses to views (English at `/`, Spanish under `/es/`).
- The site is bilingual: a wording change is done in English and Spanish together (rules in `docs/DESIGN.md`, "Two languages").
- Services: one entry in `content/services.json` per service. Its English and Spanish pages, addresses, footer link and place in the service grids all follow from that entry; a new service also needs its option in the request form (`src/lib/issues.js`) and an icon in `src/components/Icons.astro`.
- Photos: `src/assets/photos/` with their descriptions in `src/lib/photos.js`; what may be shown and how to add one is in `docs/DESIGN.md`, "Photos".
- Tools and costs: `TOOLS.md`.

## 3. Change and test
Work on a branch. Before anything is published, run:

```sh
npm run check            # both builds; every page in both languages at 360/390/820/1440px: errors,
                         # layout, links, page language, call/text numbers, touch targets, axe;
                         # the request journey in English and Spanish; every photo loads at a
                         # sensible size; HTML validity; Cloudflare's settings file (a dry-run deploy)
npm test -- --shots      # screenshots of the preview build in screenshots/site/
```

GitHub runs `npm run check` automatically on every pull request (`.github/workflows/check.yml`), so a change can't merge on a red result unnoticed. Look at the screenshots (the `-phone-first` ones show what a visitor sees on arrival) and, for design changes, run Lighthouse on the home page and one service page (mobile profile).

## 4. Publish (within permissions)
- The host is Cloudflare, in Yordan's account: a Worker named `towing-website` that serves static files only, connected to this repository through Workers Builds. Build settings: production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`; no environment variables, since `.node-version` pins Node 22. `wrangler.jsonc` says what gets uploaded (`dist/`, as built) and how a missing address is answered (the closest `404.html`, Spanish under `/es/`); keep its `name` equal to the Worker's name. `npm run serve` shows the production build exactly as Cloudflare serves it.
- The live address is https://alejostowingfl.com, set as `website` in `content/business.json` (canonical links, hreflang and the sitemap use it). It and www.alejostowingfl.com are Custom Domains on the Worker, added in the dashboard (Settings › Domains & Routes); deploys leave them alone because `wrangler.jsonc` lists no routes. https://towing-website.gozugamer09.workers.dev also still answers.
- Cloudflare also builds every other branch as a Preview with its own link (`npx wrangler preview`, which needs the `previews` block in `wrangler.jsonc`; unlisted, but anyone with the link can open it). The "Workers Builds" check on a pull request shows whether that build worked.
- Merging to `main` publishes the live site. Default permission: content and copy fixes may merge after checks pass; design, pricing, claims and anything costing money need Yordan's approval.

## 5. Report out
One short report: what changed, what was verified (with numbers), what could not be tested, preview/live links, anything needing a decision.

## 6. Restore
Every published version is a git commit and a Worker version on Cloudflare. Rollback = Cloudflare dashboard › Workers & Pages › `towing-website` › Deployments › the three-dot menu on an earlier version › Rollback (instant; the last 100 versions are kept), or revert the commit on `main` (republishes automatically).

## Independence
The live site is static files on the host's CDN. It keeps running with no AI session, no Friday, and no one's computer switched on. The request form needs no server either: it writes a text message on the customer's own phone, addressed to the company number.

## Connection options for Friday (to be explained in detail at that stage)
GitHub issues/PRs as the task queue, a scheduled or triggered Claude Code session, or the Claude API via Friday's own backend. These differ in cost: subscription usage vs. per-token API billing.
