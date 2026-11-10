# Design: jykalabs.com

The site is a letter from Jyka Labs, set as an Indian inland letter card: pale blue card stock, printed in one blue ink, with fold creases between panels. The reply panel is the contact form. Tokens live in `docs/styles.css` `:root`.

## Colour

One ink on one paper; tone comes from weight and rule density, not new hues.

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--paper` | #dce7f0 | page ground | |
| `--paper-deep` | #cfdde9 | reply panel | |
| `--paper-light` | #e8f0f6 | product panels, fields, stamp | |
| `--ink` | #16335f | headings, body, rules | 10.5:1 on paper |
| `--ink-soft` | #34507a | secondary text | 6.6:1 on paper |
| `--ink-faint` | #475f85 | field labels, fold labels | 5.2:1 on paper, 4.7:1 on reply panel |
| `--rule` | #9fb4cc | writing lines (decorative only) | |
| `--post` / `--post-dark` | #b0261c / #8e1d15 | **only** the send button, the SENT mark and form errors | white on post 6.7:1 |

Light only, no dark mode: a letter card is paper.

## Type

Schibsted Grotesk (variable, self-hosted, OFL) for everything. Display 800 with -0.035em tracking; section titles 800; field labels 700 caps with 0.12–0.16em tracking; body 400 on a 2rem ruled line. Fluid steps `--step--1` to `--step-display`.

## Components

- **Band:** sticky top band, double rule under it (the card's tear edge); nav as small caps labels.
- **Ruled rows:** `dl` rows, heading in the margin column, a hairline rule under each.
- **Address panel:** a product, double-ruled border, field label, "Coming soon" rubber stamp in ink (never red).
- **Fold:** dashed crease with a centred "Fold here" label; used twice, between the letter and the body and before the reply.
- **Fields:** filled paper-light, 2px bottom rule, red caret; textarea is ruled.
- **Send:** red rubber-stamp button, inset white keyline; the one red control.

## Motion

One authored moment: the postmark strikes the stamp on load (420ms, `--ease-out`), and the SENT mark strikes the reply on success. Both are off under reduced motion. Controls change colour in 160ms.

## Layout

Page max 74rem, gutter 1–3rem fluid, text measure 64ch. Two columns for ruled rows, products and fields above 52rem / 40rem; one column below. The band stops being sticky on phones.
