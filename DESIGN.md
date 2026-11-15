# Design: jykalabs.com

Light canvas, vivid accents (founder's brief, 2026-11-15; replaces the navy and saffron look). Tokens live in `docs/styles.css` `:root`; components use only tokens. `node tools/check-contrast.mjs` re-checks every text/background pair (all at 4.5:1 or more; control edges 3:1).

## Logo

A violet rounded tile (40 × 40, radius 10) with a white lowercase "j" stroke and a cyan dot as the j's tittle, beside the wordmark "Jyka Labs" in Bricolage Grotesque Bold. Source: `brand/logo-mark.svg` (= `docs/favicon.svg`, and the `#logo-mark` symbol in `docs/index.html`).

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` / `--surface` | #FBFAFF / #FFFFFF | page / cards and the How we work band |
| `--ink` / `--ink-muted` | #15131A / #5A5866 | text / secondary text |
| `--primary` / `--on-primary` | #5B2EE8 / #FFFFFF | primary buttons, links, focus ring |
| `--hero-a` → `--hero-b` | #5B2EE8 → #9333EA | the hero panel only (white text, lede `--hero-muted` #F1EAFF) |
| `--tile-violet/cyan/mint/pink` | #B79CFF, #5CE1E6, #9BF5B0, #FF9AD5 | service groups, icon tiles (ink text) |
| `--glow-violet/cyan/mint/pink` | #E2D8FF, #CFF7F8, #D9FBE3, #FFE0F1 | soft radial glow behind the hero and contact only |
| `--onemuster-a` → `-b` | #1D4A35 → #2E7D55 | OneMuster card and preview |
| `--thandimandi-a` → `-b` | #0057FF → #0077D9 | ThandiMandi card and preview |
| `--error`, `--ok` | #B42318, #146C43 | form errors, ticks |

Gradients are written three times: a plain colour, `linear-gradient(135deg, A, B)`, then `linear-gradient(135deg in oklch, A, B)`. One hero gradient per screen height. Frosted cards (white 80% with a white edge and backdrop blur) only over the glow, solid under `prefers-reduced-transparency`. Light only.

## Type

Bricolage Grotesque (variable, self-hosted, OFL) for headings: hero 2.6–5.25rem, 750, -0.04em, line-height 0.98; section titles 2–3.25rem, -0.035em. Geist (variable, self-hosted, OFL) for text: 1rem / 1.6, ledes 1.06–1.25rem in `--ink-muted`.

## Components

- **Header:** sticky canvas bar, hairline once scrolled; nav hides under 960px, "Talk to us" stays.
- **Hero:** a rounded gradient panel. Left: headline, lede, "Talk to us" (white) and "See our products" (translucent). Right: two product previews drawn in HTML in each product's colours, using real product wording and no figures, labelled "Illustrations of products in development".
- **Products:** one large gradient card per product with a "Coming soon" badge, one line, an outline mark (shield, snowflake); OneMuster links to onemuster.com.
- **What we do:** the seven services in four coloured groups on a 7/5 · 5/7 grid.
- **How we work:** four numbered steps on a white band (the order matters, so the numbers stay).
- **Work with us:** three white cards; each "Talk to us" button preselects the form topic.
- **Contact:** glow ground; email card and the form in frosted cards. Inline errors, "Sending…" state, email fallback with the message prefilled, success panel in place.
- **Buttons:** pills, 48px (40px small), press scales to 0.97.

## Motion

Only the hero previews rise in on load (900ms ease-out, 120ms apart); none under reduced motion. Hover changes colour or edge only.

## Layout

Container 74rem, gutter 1–2.5rem, section padding 4–7.5rem. Breakpoints 560 / 600 / 860 / 960 / 1024px; single column at phone width, checked at 360px.
