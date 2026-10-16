# Alejo’s Towing logo

The logo from the truck doors: the oval road swoosh with its dashed lane line, the star with a tow hook, ALEJO’S and TOWING. Yordan had no original file, so it was redrawn as vector shapes on 2026-10-14 from two close photos of a truck door that Yordan sent. The shapes were traced from the photos, then the letters, the hook and the width of every white outline were checked against the decal at high zoom. These SVG files are now the logo's source: edit them, not a photo.

If the sign shop that made the door lettering still has its original file, that file is the better choice for large prints such as a new truck wrap.

## The files

Each design comes in three versions:

| Version | Use it on | What differs |
|---|---|---|
| plain (`emblem.svg`) | Red, or any light color | White outlines around every shape, as on the doors |
| `-light` | White or very light backgrounds | Same look on white, without the white outlines (smaller file) |
| `-on-red` | Dark backgrounds and photos | The plain version on its own red plate with rounded corners; black lettering disappears on dark |

| Design | Files | Shape |
|---|---|---|
| Emblem: swoosh, star with hook, ALEJO’S | `emblem.svg`, `emblem-light.svg`, `emblem-on-red.svg` | About 2 : 1 |
| Stacked logo: the emblem over TOWING, as on the doors | `logo-stacked.svg`, `logo-stacked-light.svg`, `logo-stacked-on-red.svg` | About 2.5 : 1 |
| Wide logo: the emblem with TOWING beside it | `logo-horizontal.svg`, `logo-horizontal-light.svg`, `logo-horizontal-on-red.svg` | About 5 : 1 |
| Mark: the star with the tow hook | `mark.svg`, `mark-light.svg`, `mark-on-red.svg` | Almost square |

Colors: lettering black `#111111`, truck red `#c8102e` (also the site's `--accent`), white, and TOWING's gray `#444444`.

## Where the site uses them

| Place | File | Size |
|---|---|---|
| Header on phones, tablets and screens up to 1149px wide; phone menu | `emblem-light.svg` | 56px tall (48px in the menu) |
| Header from 1150px wide, where even the Spanish menu leaves room | `logo-horizontal-light.svg` | 56px tall |
| Footer | `logo-stacked-on-red.svg` | 240px wide |
| Link previews (`public/og.png`, `public/og-es.png`) | `logo-stacked.svg` on the sign's red plate | 100px tall |
| Browser tab and phone home-screen icons | `public/favicon.svg`: the star and hook from `mark.svg` on a red tile | 16 to 512px |

The components import the files with `?url`, so each build gives them a fingerprinted name that browsers keep for a year. `public/favicon.svg` holds the shapes of `mark.svg` inside a `<g transform>` that fits them to its red 64px tile; after changing `mark.svg`, paste its shapes in there and run `npm run icons`.

## Rules

- Use the files as they are: no stretching, recoloring, shadows or extra outlines. The slant of the letters is part of the logo.
- Keep the emblem at least 40px tall on screens (ALEJO’S gets hard to read below that); smaller spaces get the star mark.
- Every logo image on the site has the business name as its alt text, so screen readers announce "Alejo’s Towing".
