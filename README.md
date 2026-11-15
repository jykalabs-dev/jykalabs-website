# jykalabs.com

The Jyka Labs company website: one static page, served by GitHub Pages from the `docs/` folder of `main`, at the custom domain jykalabs.com.

- `docs/index.html`, `docs/styles.css`, `docs/main.js`: the site. No build step, no dependencies.
- `docs/fonts/`: Plus Jakarta Sans (headings), Inter (text) and JetBrains Mono (labels), self-hosted, all SIL Open Font License (the `*-OFL.txt` files).
- `docs/media/`: illustrative photos and the city loop, generated with Higgsfield on 15 Nov 2026 (see `DESIGN.md`).
- `founder/brand.md`: the brand review, voice rules and logo brief (not published).
- `docs/robots.txt`, `docs/sitemap.xml`: for search engines. `docs/og-image.png`: the share image, rendered from `brand/og.html`.
- `tools/check-contrast.mjs`: re-checks every colour pair in `docs/styles.css` against WCAG AA (`node tools/check-contrast.mjs`).
- `docs/CNAME`: the custom domain. `docs/.nojekyll`: serve files as they are.
- `PRODUCT.md`, `.impeccable/`: design notes; not published (only `docs/` is served).

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which emails each message to support@jykalabs.com (the inbox the access key was created with). The access key is set in one place, the hidden `access_key` field in `docs/index.html`; `main.js` reads it from there. It is public by design: it can only send to that inbox.

- With JavaScript, `main.js` checks the fields, sends the message as JSON and shows the result in place. If sending fails (offline, an error, a rate limit, or an empty key), it offers an email link to support@jykalabs.com with the topic and message already filled in, and keeps what was typed.
- Without JavaScript, the browser posts the form and Web3Forms redirects to `https://jykalabs.com/thanks.html`. (This redirect must be a full address: Web3Forms performs it from its own server.)
- Spam: Web3Forms' `botcheck` honeypot. No captcha, so the site still sets no cookies.

## Preview locally

```sh
python3 -m http.server 8080 -d docs
```

## Domain

GitHub Pages settings: source `main` / `docs`, custom domain `jykalabs.com`, Enforce HTTPS on (certificate for jykalabs.com and www, issued 15 Nov 2026, renewed by GitHub). At the domain registrar:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jykalabs-dev.github.io |
