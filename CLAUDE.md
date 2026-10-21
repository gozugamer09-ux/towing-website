# Working on the Alejos Towing website

Read these before changing anything:

- `docs/AGENT-WORKFLOW.md`: how a change is requested, tested, published, reported and rolled back.
- `docs/DESIGN.md`: the design rules for the "Highway" look.
- `content/business.json`: the only source of business facts.

Rules:

- Never put a business claim on the site (prices, arrival times, certifications, insurance, ratings, reviews) unless `content/business.json` or the content files mark it confirmed by Yordan. Unconfirmed items get `"pending": true` / `"confirmed": false` or the `<Pending>` component: preview builds highlight them, production builds leave them out.
- The site is in English and Spanish. Make every wording change in both languages (see "Two languages" in `docs/DESIGN.md`).
- Run `npm run check` before pushing. GitHub runs the same check on every pull request.
- Design changes, claims, pricing and anything that costs money need Yordan's approval before they merge to `main`. Copy and content fixes may merge once checks pass.
- No secrets, keys or passwords in the repository.
