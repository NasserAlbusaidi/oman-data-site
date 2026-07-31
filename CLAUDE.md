# oman-data-site

Bilingual (AR/EN) Astro site + static JSON API host for the sibling
[oman-data](https://github.com/NasserAlbusaidi/oman-data) repo. Deploys to Cloudflare Pages.

## Repo facts (load-bearing — each one has already cost a debugging session)

- **`typescript` is pinned `^6` deliberately** — `astro check` (@astrojs/check 0.9.x) needs the
  programmatic API that TS 7's native compiler dropped. `npm i -D typescript@latest` installs 7 and
  breaks `npm run typecheck` with *"does not expose the programmatic API that `astro check` relies
  on"*. Unpin when @astrojs/check supports TS 7.
- **`public/v1/` is generated, never committed** (it is gitignored). `npm run sync` copies it from
  the sibling `../oman-data/api/v1` checkout, or falls back to a shallow clone of the GitHub repo if
  that checkout is absent. **The data itself lives in the oman-data repo — fix data bugs there, not
  here.** The sync fails non-zero and names the ids if any catalog dataset lacks a `latest.json`.
- **`src/lib/data.ts` resolves `public/v1/` from `process.cwd()`, so the build must run from the
  repo root** — `import.meta.url` does not survive Astro's prerender bundling (the module lands in
  `dist/.prerender/chunks/` and a URL-relative path resolves to `dist/public/v1`, ENOENT).
- **astro 7 requires node `>=22.12`.** Pinned in three places that must stay in sync: `engines` in
  `package.json`, `.node-version` (read by Cloudflare Pages *and* by CI's `setup-node`). Pages'
  default node is older and the build fails with an engines error.
- **Astro's `compressHTML` deletes whitespace before an inline tag entirely.** A newline between
  text and a following `<a>`/`<code>` collapses to ZERO characters, not one space, so tidy source
  ships as *"lives in the`<a>`oman-data`</a>` repo"*. **Keep the space and the opening tag on the
  same source line** — never let a line break fall immediately before an inline tag. CI enforces
  this: `npm run check:glue` (`scripts/check-html-glue.mjs`, also a step in
  `.github/workflows/test.yml`) scans built `dist/*.html` for a letter or digit directly followed
  by `<a`/`<code` and fails the build. The single allowed exception is a preceding Arabic tatweel
  `ـ` (U+0640), the kashida connector in prefixes like `بـ<code>` that take no space by design.

## Commands

| command | what |
| --- | --- |
| `npm run sync` | refresh `public/v1/` from oman-data (run before test/build) |
| `npm test` | vitest; `src/lib/data.test.ts` runs against the real synced tree — it is the contract check between the two repos |
| `npm run typecheck` | `astro check` (strict tsconfig, covers `.ts` and `.astro`) |
| `npm run build` | static build to `dist/` |
| `npm run check:glue` | post-build guard for the compressHTML trap above (runs in CI) |

## Conventions

- Conventional commits, no AI attribution.
- Data access goes through `src/lib/data.ts` (`loadCatalog()` / `loadLatest(id)`) — typed,
  build-time, `node:fs`. Do not fetch `/v1/*` over HTTP at build time.
- Don't weaken `src/lib/data.test.ts` to make a sync problem go away; re-sync or fix oman-data.
