# Design guide: the "Highway" look

Chosen by Yordan on 2026-10-03 from three directions (the other two, "Night Shift" and "Truck Door", are archived in `design/preview/`). Anyone changing the site, person or agent, keeps to these rules so the site stays consistent as it grows.

## Who it is for

A driver who is stressed, outdoors, on a phone, maybe at night or in bright sun. Every page answers two questions within a second: how do I call, and how do I ask for a tow without calling.

Rules that follow from that:

- **Call and request are always one tap away.** Hero buttons on arrival; a fixed bottom bar on phones once the hero buttons scroll away (it hides while the request form is on screen); the call button in the header on wider screens.
- **One light theme.** Dark text on light backgrounds reads best in sunlight. No dark mode toggle. Two bands break from it on purpose and hold little text: the asphalt band behind the job photos and the green final banner.
- **Big targets.** Buttons are 52 to 62px tall; nothing tappable is under 44px (the test suite checks this).
- **The form asks only what dispatch needs.** Four required fields; the rest are optional and labeled so.

## Colors

All colors live as CSS variables at the top of `src/styles/global.css`.

| Token | Value | Use |
|---|---|---|
| `--accent` | `#00653a` | Guide-sign green: primary buttons, signs, plates, links |
| `--accent-deep` | `#004428` | Map base labels, pressed states |
| `--signal` | `#ffc81a` | Reflective yellow: the 24/7 shield, the call button on green, quote marks, tip borders |
| `--road` | `#2b2f2c` | Asphalt: the band behind the home page's job gallery |
| `--bg` / `--surface` / `--surface-2` | `#f3f5f1` / `#fff` / `#e8ece6` | Page, cards, quiet fills |
| `--ink` / `--muted` | `#0d1912` / `#45554b` | Text |
| `--danger` / `--ok` | `#b3261e` / `#0f7a3e` | Form errors and success |
| `--focus` | `#1a56db` | Keyboard focus ring (blue, so it never blends into green) |
| `--ph` | `#f5b800` | Preview-only highlight for unconfirmed claims |

Yellow is never used for text on white. Green text on white and white text on green both pass WCAG AA (axe checks every page).

## Type

- **Overpass** (display, weight 900): an open-source typeface inspired by Highway Gothic, the lettering on US road signs. Headings, sign text, big numbers.
- **Public Sans** (body): the US government's open-source text face, built for plain, legible reading.
- Both are self-hosted variable fonts (Latin subset, 39KB and 27KB), preloaded, with size-matched fallbacks so text doesn't jump when they load.
- Headings use `text-wrap: balance`; phone numbers never break (`.num`).

## Signature motifs

Each one comes from real highway signage. Use them for the jobs listed, not as decoration.

| Motif | Where | Class |
|---|---|---|
| Guide sign: green panel, white inset border | Photo signs (home hero, service pages), 404 sign, final banner, form callout, service side card | `.psign`, `.sign`, `.callout`, `.side-card`, `.final` |
| Sign plate | Section eyebrows ("SERVICES", "HOW IT WORKS"), photo captions in the job gallery | `.plate`, `.job figcaption` |
| Yellow 24/7 shield | Top corner of every sign | `.shield` |
| Mile-marker post | Step numbers | `.step::before` |
| Exit arrow (rotated 45°) | Sign plates, final banner | `.psign-plate .ico`, `.sign-exit .ico`, `.final-arrow` |
| Dashed lane lines | Edges of the asphalt gallery band, map routes | `.roadband`, `.fl-route` |

## Motion

Motion explains something or rewards a glance; nothing loops for attention except the small "open now" dot.

- Hero and service pages: the photo sign settles onto its posts (0.9s) and a headlight glint crosses its plate once. The settle uses movement only, never fading in, so the photo shows the moment it loads (it is the largest thing on the first screen, which is what Google's speed score times).
- Map: route dashes move only while the map is on screen.
- Photos: on devices with a mouse, a gallery or service-card photo zooms in slightly under the pointer.
- FAQ answers open and close smoothly; pages cross-fade between each other.
- With "reduce motion" turned on in the phone's settings, all of this is switched off and the final state shows immediately.

## Layout

- Content width 1180px; side gutter 16px on phones growing to 32px.
- Mobile first. Main breakpoints: 600px (two-column tiles), 760px (bottom bar off), 900 to 940px (two-column page layouts), 1000px (full navigation in the header).
- The request form on phones goes: heading, the "in a dangerous spot? call" box, the form, then the reassurance notes. On wide screens the notes and call box sit left of the form.

## Unconfirmed claims (placeholders)

- Every business fact comes from `content/*.json`. A fact Yordan hasn't confirmed is marked there (`"pending": true`, `"confirmed": false`) or wrapped in `<Pending>` in a page.
- **Preview builds** (`npm run build:preview`) show those claims highlighted in yellow with a "Needs confirming" tag ("Falta confirmar" on Spanish pages), plus a preview notice bar, and tell search engines not to index the preview.
- **Production builds** (`npm run build`) leave them out entirely. Nothing unconfirmed can reach the live site by accident.

## Writing

- Plain, calm, short sentences, written to "you".
- No prices, arrival times, guarantees or certifications unless Yordan has confirmed them; reviews may say "fast" in the customer's own words.
- Reviews are shown verbatim in the original language, with our English translation labeled as a translation. No star ratings that we can't source.

## Two languages

Yordan's customers mostly speak Spanish, and Spanish is the preferred language for calls and texts (confirmed 2026-10-04). The whole site exists in both languages:

- English at the site root, Spanish under `/es/` with Spanish page addresses (`/es/pedir-grua/`, `/es/servicios/grua/`). `src/lib/i18n.js` holds the address table and the shared interface wording.
- A slim green bar above the header links to the same page in the other language ("Hablamos español. Ver en español" / "View in English"); the phone menu and the footer repeat the link. Search engines get `hreflang` links once `SITE_URL` is set.
- The home page opens in the phone's language: someone arriving at `/` from outside the site with a phone set to Spanish gets `/es/`. A language the visitor picked before wins (remembered in the browser), and links within the site never switch language. Search engines see the English home. (Yordan chose this over English first or Spanish first, 2026-10-04.)
- The request form writes its text message in the page's language, so a Spanish request arrives in Spanish.
- Spanish pages show reviews in the customer's own words; English pages show our labeled translation.
- **Every wording change is made in both languages in the same change.** Page wording sits at the top of each file in `src/views/` (`COPY.en` and `COPY.es`); services and FAQ answers carry their Spanish in an `"es"` object in `content/*.json`.

Spanish style:

- Formal "usted", plain and warm. Neutral US Spanish that Cuban, Puerto Rican, Mexican and South American customers all read easily.
- Words chosen for Southwest Florida: "carro", "grúa", "goma" (with "llanta" once where it helps: "goma o llanta ponchada"), "winche", "pickup", "SUV", "paso de corriente", "la Florida".
- Button labels are short verbs: "Llamar", "Pedir grúa", "Enviar por texto".
- The business name "Alejos Towing", city names and highway names stay as they are.

## Photos

Only Yordan's own photos of his trucks, never stock photos: a customer should see the truck that will pull up. He sent 64 photos and a video on 2026-10-04; 17 photos are on the site.

Where they go:

- **Home hero:** the red flatbed on a highway shoulder (`truck-highway-front`), as the face of a guide sign with the 24/7 shield and an "Alejos Towing" plate (`PhotoSign`).
- **Service pages:** the same photo sign with that service's photo, chosen in `content/services.json` (`"photo"`). The services page shows the same photos on its cards.
- **Job gallery (home):** nine loads that show the range, from a Ford Model T to a backhoe, each captioned with what it carried, on the asphalt band. Order and choice: `GALLERY` in `src/lib/photos.js`.
- **"Look for our name on the door" (home, trust section):** the door lettering, so a customer can tell it's really us when a truck arrives.

Rules for every photo:

- No readable customer license plates (blur them first; the door photo's minivan plate is blurred), no other businesses' names, logos or phone numbers, and no people who haven't agreed to be shown. The company's own lettering, the bed maker's mud flaps and equipment makers' names are fine.
- Captions say what was carried ("Box truck"), never whose it was or where it went.
- Each photo has a description in both languages for screen readers. A photo that only decorates a link that already names its page (the services cards) is marked decorative.
- Photos show what the truck carried, but they are not a claim: a load in the gallery (like heavy equipment) doesn't add a service to the services list until Yordan confirms it.

Adding or changing a photo:

1. Resize the original to 1600px on the long side (JPEG) and save it in `src/assets/photos/` with a name that says what it shows (`flatbed-empty.jpg`).
2. Add it to `src/lib/photos.js` with its English and Spanish description (`alt`), a short caption if it goes in the gallery, and `pos` if a crop needs to keep a particular part in view (CSS `object-position`, e.g. `'0% 50%'` keeps the left edge).
3. Use it with `<Photo id="..." sizes="...">` (or `PhotoSign`). `sizes` must say how wide the photo shows at each screen width, so phones download the small file; the test suite checks the file picked matches the space.

Astro turns each photo into AVIF (quality 40, set in `astro.config.mjs`) with a WebP fallback, at 480, 800 and 1120px wide (480 and 800 for small tiles). The first photo on a page loads right away with high priority; all others load as they come near the screen. Share images (`public/og.png`, `public/og-es.png`) use the hero photo; regenerate them with `npm run icons`.

## Accessibility checklist (automated in `tests/site.mjs`)

Every photo loads and has a description (or is marked decorative), one `<h1>` per page, the page's language set (`lang="en"` or `lang="es"`) with a working link to the other language, skip link, visible focus ring, labeled form fields with an error summary that links to each problem, live messages for location lookup, decorative graphics hidden from screen readers, 44px touch targets, no sideways scrolling at 360px, axe scan with zero violations at phone and desktop sizes.
