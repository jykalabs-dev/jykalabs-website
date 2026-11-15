# Design: jykalabs.com

"Tactile industrial-tech" (founder's brief, 15 Nov 2026): crisp, architectural and high-contrast. 1px hairlines, generous whitespace and quiet surfaces instead of gradients, glows or heavy shadows. Light theme by default, with a dark theme the visitor can choose (kept in `localStorage` as `jyka-theme`; no cookies). Tokens live in `docs/styles.css` (`:root` light, `[data-theme="dark"]` dark); components use only tokens. `node tools/check-contrast.mjs` re-checks 20 pairs in each theme.

## Logo

"Progress Ring" (chosen by the founder, 16 Nov 2026, replacing "Joined JL"): a JL monogram inside a ring that is three-quarters complete. The JL and the ring are metal (polished silver on dark, gunmetal and steel on light); the arc is copper, with a small gap where it meets the ring. Beside or under it, "JYKALABS" in Plus Jakarta Sans: JYKA 800, LABS 500 in copper.

- `brand/logo-mark.svg`, `brand/logo-stacked.svg`, `brand/logo-horizontal.svg`: for light backgrounds.
- `brand/logo-*-on-dark.svg`: the same for dark backgrounds.
- `docs/favicon.svg`: the dark mark on an obsidian rounded tile.
- The `#logo-mark` symbol in `index.html` takes its gradient stops from the `--logo-*` tokens, so it switches with the theme. The header wordmark is live text using `--logo-word` and `--logo-labs`.
- The wordmark in the SVG files is live text. Convert it to outlines before print or handing files to others. Before registering the logo, run a trademark search (classes 9 and 42 on ipindia.gov.in).

## Colour

Taken from the logo: obsidian, silver and copper in dark; warm white, gunmetal, steel and dark copper in light. `node tools/check-contrast.mjs` checks 24 pairs in each theme, including the wordmark and the logo's arc and ring.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg-canvas` / `--bg-surface` / `--bg-subtle` | #F4F4F1 / #FFFFFF / #ECECE8 | #0A0A0C / #131316 / #1B1B20 | page / cards / pills, selected tabs |
| `--border-hairline` / `--border-control` | #DDDDD8 / #7E848D | #26262C / #6B7079 | dividers / input edges (3:1) |
| `--text-primary` / `--text-secondary` | #16171B / #4E535B | #E9EBEF / #A3A8B1 | text |
| `--accent-primary` (+ `-hover`) | #8A4520 / #6B3214 | #CC7A47 / #DA8D5C | primary buttons, links, focus |
| `--on-accent` | #FFFFFF | #0A0A0C | text on the primary button |
| `--accent-highlight` | #9A4E24 | #C0703F | status dots |
| `--highlight-text` / `--highlight-soft` | #6B3214 / #F6ECE5 | #D88B5A / #24170F | status pill text and fill |
| `--logo-*` | gunmetal JL, steel ring, #6B3214 to #93491F arc | silver JL and ring (ring at 50%), #9A4E24 to #C0703F arc | the mark and wordmark |

The dark theme's links and buttons use a slightly lighter copper than the logo's arc so text meets 4.5:1 on obsidian.

## Type

Plus Jakarta Sans 600/700 at -0.03em for headings (hero -0.035em). Inter 400/500 for text. JetBrains Mono 500 only for status pills and the character counter (data, not decoration). All OFL, self-hosted in `docs/fonts/` (not from Google Fonts, so visitors' addresses aren't sent to a third party).

## Imagery

Technology still lifes in the logo's palette (obsidian, silver, copper), generated with Higgsfield on 16 Nov 2026 to replace the earlier building and street photos, which didn't read as a tech company (founder). GPT Image 2.6 for stills, Kling 3.0 for the clip. No people, screens, text or brand-like products. No captions on the page (founder, 16 Nov 2026).

- Hero: `circuit` (OneMuster tab), `cooling` (ThandiMandi tab), WebP at 800 and 1168 wide.
- Product cards: `cables` (OneMuster), `rack` (ThandiMandi), WebP at 800 and 1344.
- Ambient band: `grid-loop.mp4` (960×540, 5 s, silent) over the `grid` still, which is also the poster under reduced motion or data saver.

## Components

- **Header:** sticky, translucent with blur where supported; wordmark, three links, theme toggle, "Start a conversation".
- **Hero:** headline, intro, primary button, "See our products". Right: product tabs (arrow keys, Home/End) over a photo of each product's setting, with a small card: name, status and one line. No feature detail: the founder keeps product specifics off the public site (15 Nov 2026).
- **Products:** asymmetric bento (1.45 : 1), photo on top, status pill, name, status and one line only (no feature lists).
- **Ambient band:** a copper-lit grid, muted, looping only while on screen, with a pause button; a still photo with reduced motion or data saver.
- **What we do:** a 2 × 2 hairline grid, type only (no icon tiles); a top rule draws in on hover.
- **Let's talk:** three audience cards that pick the topic, bring the form into view and focus it; the form with a live character count, inline errors, "Sending…", email fallback and success in place.

## Spacing

Sections are 3–5rem top and bottom (`--section`). On wide screens each section heading sits beside its intro text, so the width is used rather than leaving an empty column. Hero, card photos, the city band and the form are kept compact. Laptop page height went from 4,684 px to 3,649 px on 15 Nov 2026.

## Motion

160–200 ms ease-out for state changes; reveals once on scroll (12px, 420 ms). Under `prefers-reduced-motion` nothing moves, the video never loads, and every element shows in its final state. Without JavaScript, everything is visible and the form still posts to Web3Forms.
