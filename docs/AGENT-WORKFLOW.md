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
- Page text that isn't a business fact: `content/services.json`, `content/faq.json`, `content/reviews.json`, and the page files in `src/pages/`.
- Tools and costs: `TOOLS.md`.

## 3. Change and test
Work on a branch. Before anything is published, run:

```sh
npm run check            # both builds; every page at 360/390/820/1440px: errors, layout, links,
                         # call/text numbers, touch targets, axe; the request journey; HTML validity
npm test -- --shots      # screenshots of the preview build in screenshots/site/
```

GitHub runs `npm run check` automatically on every pull request (`.github/workflows/check.yml`), so a change can't merge on a red result unnoticed. Look at the screenshots (the `-phone-first` ones show what a visitor sees on arrival) and, for design changes, run Lighthouse on the home page and one service page (mobile profile).

## 4. Publish (within permissions)
- Every branch gets a private preview link from the host.
- Merging to `main` publishes the live site. Default permission: content and copy fixes may merge after checks pass; design, pricing, claims and anything costing money need Yordan's approval.

## 5. Report out
One short report: what changed, what was verified (with numbers), what could not be tested, preview/live links, anything needing a decision.

## 6. Restore
Every published version is a git commit and a host deployment. Rollback = promote the previous deployment in the host dashboard (instant) or revert the commit on `main` (republishes automatically).

## Independence
The live site is static files on the host's CDN. It keeps running with no AI session, no Friday, and no one's computer switched on. The request form needs no server either: it writes a text message on the customer's own phone, addressed to the company number.

## Connection options for Friday (to be explained in detail at that stage)
GitHub issues/PRs as the task queue, a scheduled or triggered Claude Code session, or the Claude API via Friday's own backend. These differ in cost: subscription usage vs. per-token API billing.
