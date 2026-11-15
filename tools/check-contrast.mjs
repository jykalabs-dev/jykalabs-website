// Re-checks every text/background pair the site uses against WCAG 2.2 AA (4.5:1 for text, 3:1 for control edges).
// Reads the colour tokens from docs/styles.css :root, so a changed token is checked on the next run.
// Run: node tools/check-contrast.mjs   (exits 1 if any pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../docs/styles.css", import.meta.url), "utf8");
const root = css.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
const tokens = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2]]));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [foreground token, background token, minimum, where it is used]
const pairs = [
  ["ink", "canvas", 4.5, "body text on the page"],
  ["ink", "surface", 4.5, "text on cards"],
  ["ink-muted", "canvas", 4.5, "secondary text on the page"],
  ["ink-muted", "surface", 4.5, "secondary text on cards"],
  ["on-primary", "primary", 4.5, "primary button"],
  ["primary", "surface", 4.5, "links and the focus ring on cards"],
  ["primary", "canvas", 4.5, "links and the focus ring on the page"],
  ["on-primary", "hero-a", 4.5, "hero text, gradient start"],
  ["on-primary", "hero-b", 4.5, "hero text, gradient end"],
  ["hero-muted", "hero-a", 4.5, "hero lede, gradient start"],
  ["hero-muted", "hero-b", 4.5, "hero lede, gradient end"],
  ["primary", "on-primary", 4.5, "white button on the hero"],
  ...["tile-violet", "tile-cyan", "tile-mint", "tile-pink"].map((t) => ["ink", t, 4.5, `service group on ${t}`]),
  ...["glow-violet", "glow-cyan", "glow-mint", "glow-pink"].map((t) => ["ink", t, 4.5, `text over ${t}`]),
  ...["glow-violet", "glow-cyan", "glow-mint", "glow-pink"].map((t) => ["ink-muted", t, 4.5, `secondary text over ${t}`]),
  ["on-primary", "onemuster-a", 4.5, "OneMuster card, gradient start"],
  ["on-primary", "onemuster-b", 4.5, "OneMuster card, gradient end"],
  ["onemuster-a", "on-primary", 4.5, "OneMuster badge"],
  ["on-primary", "thandimandi-a", 4.5, "ThandiMandi card, gradient start"],
  ["on-primary", "thandimandi-b", 4.5, "ThandiMandi card, gradient end"],
  ["thandimandi-a", "on-primary", 4.5, "ThandiMandi badge"],
  ["error", "surface", 4.5, "form errors"],
  ["ok", "surface", 4.5, "form success"],
  ["control", "surface", 3, "input edges"],
];

let failed = 0;
for (const [fg, bg, min, use] of pairs) {
  if (!tokens[fg] || !tokens[bg]) { console.log(`MISSING  --${!tokens[fg] ? fg : bg} (${use})`); failed++; continue; }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  --${fg} on --${bg}  ${use}`);
}
console.log(failed ? `\n${failed} pair(s) failed` : `\nAll ${pairs.length} pairs pass`);
process.exit(failed ? 1 : 0);
