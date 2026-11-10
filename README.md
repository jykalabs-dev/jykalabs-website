# jykalabs.com

The Jyka Labs company website: one static page, served by GitHub Pages from the `docs/` folder of `main`, at the custom domain jykalabs.com.

- `docs/index.html`, `docs/styles.css`, `docs/main.js`: the site. No build step, no dependencies.
- `docs/fonts/`: Schibsted Grotesk (SIL Open Font License, `docs/fonts/OFL.txt`), self-hosted.
- `docs/CNAME`: the custom domain. `docs/.nojekyll`: serve files as they are.
- `PRODUCT.md`, `.impeccable/`: design notes; not published (only `docs/` is served).

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which emails each message to the address the access key was created with. No address appears on the site.

To turn it on, create an access key at web3forms.com with the inbox that should receive messages, and paste it into `docs/index.html`:

```html
<input type="hidden" name="access_key" value="YOUR-ACCESS-KEY">
```

Until the key is set, the form shows "The form isn't available yet." The key is designed to be public; it can only send to the inbox it was created for.

## Preview locally

```sh
python3 -m http.server 8080 -d docs
```

## Domain

GitHub Pages settings: source `main` / `docs`, custom domain `jykalabs.com`, enforce HTTPS. At the domain registrar:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jykalabs-dev.github.io |
