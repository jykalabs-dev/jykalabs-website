// Re-checks every text/background pair the site uses against WCAG 2.2 AA (4.5:1 for text, 3:1 for control edges and
// large or non-text marks), in both themes. Reads the tokens from docs/styles.css (:root for light,
// [data-theme="dark"] for dark), so a changed token is checked on the next run.
// Run: node tools/check-contrast.mjs   (exits 1 if any pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../docs/styles.css", import.meta.url), "utf8");
const block = (re) => Object.fromEntries([...(css.match(re)?.[1] ?? "").matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2]]));
const light = block(/:root\s*{([^}]*)}/);
const themes = { light, dark: { ...light, ...block(/\[data-theme="dark"\]\s*{([^}]*)}/) } };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [foreground token, background token, minimum, where it is used]
const pairs = [
  ["text-primary", "bg-canvas", 4.5, "body text"],
  ["text-primary", "bg-surface", 4.5, "text on cards"],
  ["text-primary", "bg-subtle", 4.5, "selected tab"],
  ["text-secondary", "bg-canvas", 4.5, "secondary text"],
  ["text-secondary", "bg-surface", 4.5, "secondary text on cards"],
  ["text-secondary", "bg-subtle", 4.5, "pills and quiet status"],
  ["accent-primary", "bg-canvas", 4.5, "links and focus"],
  ["accent-primary", "bg-surface", 4.5, "links on cards"],
  ["on-accent", "accent-primary", 4.5, "primary button"],
  ["on-accent", "accent-primary-hover", 4.5, "primary button on hover"],
  ["text-primary", "accent-soft", 4.5, "attendance result"],
  ["accent-primary", "accent-soft", 3, "tick on the result"],
  ["highlight-text", "highlight-soft", 4.5, "status pill text"],
  ["accent-highlight", "bg-surface", 3, "status dot"],
  ["error", "bg-surface", 4.5, "form errors"],
  ["text-primary", "error-soft", 4.5, "fallback text"],
  ["highlight-text", "bg-surface", 4.5, "counter warning"],
  ["border-control", "bg-canvas", 3, "input edges"],
  ["border-control", "bg-surface", 3, "input edges on cards"],
  ["bg-canvas", "text-primary", 4.5, "skip link"],
  ["logo-word", "bg-canvas", 4.5, "JYKA in the wordmark"],
  ["logo-labs", "bg-canvas", 4.5, "LABS in the wordmark"],
  ["logo-arc-1", "bg-canvas", 3, "copper arc of the logo"],
  ["logo-ring-1", "bg-canvas", 3, "silver ring of the logo (light theme; dark uses it at half strength as a track)"],
];

let failed = 0, total = 0;
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n${name}`);
  for (const [fg, bg, min, use] of pairs) {
    total++;
    if (!t[fg] || !t[bg]) { console.log(`MISSING  --${!t[fg] ? fg : bg} (${use})`); failed++; continue; }
    const r = ratio(t[fg], t[bg]);
    if (r < min) failed++;
    console.log(`${r >= min ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  --${fg} on --${bg}  ${use}`);
  }
}
console.log(failed ? `\n${failed} of ${total} pair(s) failed` : `\nAll ${total} pairs pass`);
process.exit(failed ? 1 : 0);
