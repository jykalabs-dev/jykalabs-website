# Design: jykalabs.com

"Tactile industrial-tech" (founder's brief, 15 Nov 2026): crisp, architectural and high-contrast. 1px hairlines, generous whitespace and quiet surfaces instead of gradients, glows or heavy shadows. Light theme by default, with a dark theme the visitor can choose (kept in `localStorage` as `jyka-theme`; no cookies). Tokens live in `docs/styles.css` (`:root` light, `[data-theme="dark"]` dark); components use only tokens. `node tools/check-contrast.mjs` re-checks 20 pairs in each theme.

## Logo

"Joined JL" (chosen by the founder, 15 Nov 2026): a J and an L drawn as two 5.5-unit strokes with square ends on a 48-unit grid, the J hooking left and the L footing right, with a small amber square at the top right of the L. It stands for Jyka Labs and needs no tile. Beside it, "Jyka Labs" set in Plus Jakarta Sans 700, with "Labs" in the secondary colour.

- `brand/logo-mark.svg`: ink #111312, amber #D97724, for light backgrounds.
- `brand/logo-mark-on-dark.svg`: #F2F4F3 and #F59E0B.
- `docs/favicon.svg`: the mark scaled to 72% inside a dark rounded tile (rx 10), readable at 16 px.
- The `#logo-mark` symbol in `index.html` follows the theme.

Drawn here from simple shapes, so it isn't copied from anyone. Before registering it, run a trademark search for similar device marks (classes 9 and 42 on ipindia.gov.in).

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg-canvas` / `--bg-surface` / `--bg-subtle` | #F8F8F6 / #FFFFFF / #F0F0EC | #0B0D0C / #141816 / #1C221F | page / cards / pills, selected tabs |
| `--border-hairline` / `--border-control` | #E2E2DC / #7A817D | #232926 / #5E6762 | dividers / input edges (3:1) |
| `--text-primary` / `--text-secondary` | #111312 / #525855 | #F2F4F3 / #949E99 | text |
| `--accent-primary` (+ `-hover`) | #0F5C4C | #28A789 | primary buttons, links, focus, ticks |
| `--on-accent` | #FFFFFF | #0B0D0C | text on the primary button |
| `--accent-highlight` | #D97724 | #F59E0B | status dots, logo tittle, the Offline pill |
| `--highlight-text` / `--highlight-soft` | #9A4E0E / #FBF0E4 | #F59E0B / #2A2112 | status pill text and fill (the brief's amber is too light for text on white) |

## Type

Plus Jakarta Sans 600/700 at -0.03em for headings (hero -0.035em). Inter 400/500 for text. JetBrains Mono 500 only for status pills and the character counter (data, not decoration). All OFL, self-hosted in `docs/fonts/` (not from Google Fonts, so visitors' addresses aren't sent to a third party).

## Imagery

Photos and the city loop were generated with Higgsfield (Kling O1 image, Kling 3.0 video) on 15 Nov 2026 and are labelled "Illustrative" on the page. They show settings, never people or customers. Sources: `docs/media/` (WebP at 800 and 1400/1600 wide; `city-loop.mp4` 960×540, 5 s, silent).

## Components

- **Header:** sticky, translucent with blur where supported; wordmark, three links, theme toggle, "Start a conversation".
- **Hero:** headline, intro, primary button, "See our products". Right: product tabs (arrow keys, Home/End) over a photo of each product's setting, with a small card: name, status and one line. No feature detail: the founder keeps product specifics off the public site (15 Nov 2026).
- **Products:** asymmetric bento (1.45 : 1), photo on top, status pill, name, status and one line only (no feature lists).
- **Ambient band:** the city at dawn, muted, looping only while on screen, with a pause button; a still photo with reduced motion or data saver.
- **What we do:** a 2 × 2 hairline grid, type only (no icon tiles); a top rule draws in on hover.
- **Let's talk:** three audience cards that pick the topic, bring the form into view and focus it; the form with a live character count, inline errors, "Sending…", email fallback and success in place.

## Spacing

Sections are 3–5rem top and bottom (`--section`). On wide screens each section heading sits beside its intro text, so the width is used rather than leaving an empty column. Hero, card photos, the city band and the form are kept compact. Laptop page height went from 4,684 px to 3,649 px on 15 Nov 2026.

## Motion

160–200 ms ease-out for state changes; reveals once on scroll (12px, 420 ms). Under `prefers-reduced-motion` nothing moves, the video never loads, and every element shows in its final state. Without JavaScript, everything is visible and the form still posts to Web3Forms.
