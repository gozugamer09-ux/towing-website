# Alejos Towing website: tools record

Last updated 2026-10-04. Costs are in USD and come from general knowledge, not live price pages; each one gets re-checked with Yordan before anything is bought.

## 1. Development tools (installed and tested in the build environment)

None of these is sent to website visitors. All free and open source.

| Tool | Purpose | Status |
|---|---|---|
| Node 22, npm, git | Build scripts, version history | Working |
| Astro 7.3 (+ @astrojs/sitemap) | Builds the site into plain HTML and CSS, with almost no JavaScript | In use; 16 pages build in about 1.5 seconds |
| Playwright 1.56 + Chromium | Real-browser checks of every page at 360, 390, 820 and 1440px wide, the request journey, keyboard use, screenshots | In use (`npm test`) |
| axe-core | Accessibility scan (WCAG), including color contrast | 0 problems on all 16 pages, phone and desktop |
| Lighthouse 12 | Speed, accessibility, best practices and search basics on a simulated slow phone connection | Production build, 2026-10-04: home 99/100/100/100, towing page 100/100/100/100, request page 100/100/100/100 |
| html-validate | HTML correctness | 0 errors on every page (one rule switched off in `.htmlvalidate.json`: phone numbers are kept on one line with CSS instead) |
| sharp | Makes the icons and the link-preview images; turns Yordan's photos into AVIF/WebP at three sizes during every build | In use (`npm run icons`, `npm run build`) |
| ImageMagick | Prepared Yordan's photos once: resized to 1600px, cropped one, blurred a customer's license plate | Used in the build environment only; not needed to build or run the site |
| us-atlas, topojson-client, d3-geo | Draw the Florida service-area map from US Census boundaries | Used once to generate `src/data/florida.json` (`npm run map`) |

## 2. What visitors download

| Item | Size | Notes |
|---|---|---|
| Page HTML (includes all CSS, the icon set and the map) | Home page about 20KB compressed; other pages about 14KB | One request per page, nothing blocks the first paint |
| Photos (AVIF, WebP for older browsers) | 15–65KB each on a typical phone; the home page's first photo 56KB (112KB on the sharpest phone screens) | Only the first photo loads at once; the rest load as they scroll into view |
| Fonts: Overpass and Public Sans (Fontsource, open font license) | 39KB + 27KB, cached after the first page | Self-hosted, preloaded, with size-matched fallbacks |
| JavaScript | About 5KB for the request form, plus a small inline script for the menu and phone action bar | No framework |
| Third parties | None | No trackers, no cookies, no ads, no outside requests |

## 3. Integrations (need an account, permission, or money)

| Service | Purpose | Cost | Status |
|---|---|---|---|
| GitHub repository `gozugamer09-ux/towing-website` | Version history, backups, source for deploys | Free | Created by Yordan. The site is on branch `site/highway`, waiting for his approval to go to `main` |
| Cloudflare Pages (recommended host) | Hosting, HTTPS, global CDN, a private preview link for every change, one-click rollback | Free tier | Needs Yordan's free Cloudflare account. Cache and security headers are ready in `public/_headers` |
| Domain name (e.g. alejostowing.com) | The site's address | About $10–15 per year | Not bought. Needs Yordan's decision |
| Request form | Opens a text to (239) 888-7001 on the customer's own phone, with every detail and an optional GPS map link | Free, no service | Built and tested in a browser; still needs one real test from a phone |
| Email copy of each request (optional) | Backup copy to alejostowing85@gmail.com | Free tiers exist (e.g. Web3Forms) | Not set up. Only if Yordan wants it |
| Cloudflare Web Analytics | Visitor counts without cookies or a consent banner | Free | Not set up; comes with the Cloudflare account |
| Google Business Profile, Search Console | Google rating and review count for the site; search visibility | Free | Need Yordan's profile link (and the domain, for Search Console) |
| Service-area map | Florida map with routes | Free | Done, built into the page; no Google Maps account or API key needed |

Connectors that failed to connect in this environment (Figma, Canva, Notion, Slack and others returned a network-policy error) are not needed for the site.

## 4. Generated artifacts

| Artifact | Where |
|---|---|
| Clickable preview of the full site | https://claude.ai/artifact/CkV5aZ9LEXGV7aa7288KTg (earlier versions showed the three design directions) |
| Screenshots of every page and size | `screenshots/site/` after `npm test -- --shots` (not stored in git) |
| Design-direction preview | `design/preview/alejos-preview.html` |

## 5. Running the site long term

- **Hosting:** static files on Cloudflare Pages. No server, database or AI session to keep alive; the site stays up on its own.
- **Yearly:** domain renewal (set to auto-renew).
- **Optional, later:** a scheduled check that runs the test suite against the live site and reports problems, and the Friday connection described in `docs/AGENT-WORKFLOW.md`.

## Credentials rule

API keys and passwords go in the hosting provider's encrypted settings, never in the repository or the website's public files. The site currently needs none.
