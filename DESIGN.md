# Design: jykalabs.com

A product-company site at the craft level of Stripe, Linear and Vercel: white and cool-grey grounds, navy ink, one saffron accent. Tokens live in `docs/styles.css` `:root`; nothing below hard-codes a colour.

## Logo

A navy rounded tile (40 × 40, radius 10) with a white lowercase "j" stroke and a saffron dot as the j's tittle, beside the wordmark "Jyka Labs" in Geist Bold, tracking -0.03em. On navy, the tile inverts (white tile, navy j); the dot stays saffron. Source: `brand/logo-mark.svg` (also `docs/favicon.svg` and the `#logo-mark` symbol in `docs/index.html`).

## Colour

| Token | Value | Use | Contrast on white |
| --- | --- | --- | --- |
| `--ink` | #0b1f3f | headings, primary buttons, logo tile | 16:1 |
| `--text` | #1f2937 | body | 14:1 |
| `--muted` | #4b5563 | secondary text | 7.5:1 |
| `--blue` | #2346c8 | links, focus ring | 7.4:1 |
| `--control` | #8a94a6 | input and secondary-button edges | 3.1:1 |
| `--line` | #e3e6ec | hairlines, card edges | decorative |
| `--canvas` | #f6f7f9 | tinted sections | |
| `--navy-900` | #071630 | "How we work" and footer ground | |
| `--on-dark` / `--on-dark-muted` | #e8edf6 / #a9b6cc | text on navy | 14:1 / 8.3:1 |
| `--saffron` / `--saffron-soft` | #f2a516 / #fdf2dc | logo dot, "coming soon", current step, step numbers | never body text |
| `ok`, `warn`, `alert` (+ `-soft`) | #146c43, #8a5300, #b42318 | status pills in illustrations, form errors | all ≥ 4.5:1 on their soft tint |

Light only; no dark mode.

## Type

Geist (variable, self-hosted, OFL). Hero 2.5–4.5rem, 700, -0.04em, line-height 1.02. Section titles 1.75–2.75rem, 700, -0.035em. Card titles 1.25–1.5rem, 650. Body 1rem / 1.6; ledes 1.06–1.19rem in `--muted`. Numbers in illustrations are tabular.

## Components

- **Buttons:** pills, min height 48px (40px small). Primary navy; secondary white with a `--control` edge. Press scales to 0.97.
- **Header:** sticky, translucent white with a hairline; nav hides under 1024px, "Contact us" stays.
- **Capabilities:** a white hairline grid (4 / 2 / 1 columns), icon tile + title + one sentence; the last cell is a navy call to action.
- **Product cards:** a navy art panel with a drawn mark (shield for OneMuster, snowflake for ThandiMandi), the name, a "Coming soon" badge and one line. No feature detail (founder's rule).
- **Process:** four steps on navy with saffron numbers (the order is the point).
- **Paths:** three bordered panels, each ending in an arrow link that preselects the form topic.
- **Form:** white card, 48px fields, blue focus ring, inline errors in `--alert`, privacy note under a hairline.
- **Illustrations:** drawn in HTML/CSS/SVG with skeleton bars instead of figures, so they show shapes, never invented numbers or customers. `docs/og-image.png` is rendered from `brand/og.html`.

## Motion

- Hero: window and phone rise in sequence, the chart line draws itself, the two status chips pop in; the phone and automation chip float gently and the saffron orbit turns slowly.
- Scroll: sections and grid items fade up as they enter (700ms, ease-out, 70ms stagger within a group). The OneMuster check draws and the ThandiMandi snowflake turns into place when their cards appear.
- Hover (fine pointers only): capability icons fill navy, cards lift 2–3px. Header gains a soft shadow once the page scrolls.
- Content is visible without JavaScript; all movement is off under reduced motion.

## Layout

Container 76rem, gutter 1–2.5rem fluid, section padding 4.5–8rem. Single column under 1024px; stacked pillars, paths and form fields under 768px.
