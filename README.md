# Alejos Towing website

The website for Alejos Towing (24/7 towing and roadside help, Cape Coral and Fort Myers, anywhere in Florida), in English and Spanish. A static site built with [Astro](https://astro.build): fast pages, almost no JavaScript, and nothing that needs a server or an AI session to keep running.

## Where things are

| Path | What it is |
|---|---|
| `content/business.json` | Single source of business facts. Each fact says whether Yordan confirmed it. |
| `content/services.json`, `faq.json`, `reviews.json` | Service pages, questions and answers, Google reviews (original text plus labeled translation). Spanish wording sits in each item's `"es"` object. |
| `src/views/` | One file per page (home, services, service area, reviews, request, FAQ, privacy, 404), with its English and Spanish wording at the top. |
| `src/pages/` | Page addresses: English at `/`, Spanish under `/es/`. Each file just shows a view. |
| `src/lib/i18n.js` | The two languages: page addresses in each, and the shared interface wording (header, footer, buttons). |
| `src/components/` | Reusable parts: header, footer, hero sign, request form, map, cards. |
| `src/styles/global.css` | The whole design system (colors, type, components). Rules in `docs/DESIGN.md`. |
| `public/` | Icons, share image, web manifest. Regenerate with `npm run icons`. |
| `scripts/` | Generators for the Florida map data and the icons. Development only. |
| `tests/site.mjs` | Checks every page at phone, tablet and desktop sizes, plus the request journey. |
| `docs/AGENT-WORKFLOW.md` | How a change is requested, tested, published, reported and rolled back (ready for Friday). |
| `docs/DESIGN.md` | Design rules for the "Highway" look. |
| `TOOLS.md` | Tools, services and costs. |
| `design/preview/` | Archive of the three design directions explored before Highway was chosen. |

## Commands

```sh
npm install              # once
npm run dev              # local preview while editing, with unconfirmed claims highlighted
npm run build:preview    # preview build in dist-preview/ (unconfirmed claims highlighted, not indexed)
npm run build            # production build in dist/ (unconfirmed claims left out)
npm test                 # check dist-preview/ (add "dist" to check production; add --shots for screenshots)
npm run check            # everything GitHub checks on a pull request: both builds, all tests, HTML validity
npm run share            # self-contained copy of the preview in dist-artifact/, for sharing as a Claude artifact
```

Set `SITE_URL` (for example `SITE_URL=https://alejostowing.com npm run build`) once the domain exists; that turns on canonical links, the sitemap and full URLs in the business data.

## Status

The full site is built and tested in preview. Before launch it needs: a host account (Cloudflare Pages, free), a domain, the remaining business confirmations listed in `content/business.json` (`open_question` entries), and one real test request sent from Yordan's phone.
