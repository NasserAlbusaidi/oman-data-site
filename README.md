# oman-data-site

Bilingual (AR/EN) docs site + static JSON API host for
[oman-data](https://github.com/NasserAlbusaidi/oman-data) — the unofficial
developer layer for Oman's open data.

Build pulls `api/v1/` from the oman-data repo (sibling checkout or shallow
clone), renders a catalog + per-dataset pages, and deploys to Cloudflare
Pages with CORS open on `/v1/*`.

Code MIT. Data: license of each official source. Not affiliated with any
government entity.

## Develop

Needs node >= 22.12 (see `.node-version`).

```sh
npm install
npm run sync   # fills public/v1/ from ../oman-data, or shallow-clones it
npm run dev    # http://localhost:4321
```

`public/v1/` is generated and gitignored, and both the tests and the build
read it off disk — so `npm run sync` comes before `npm test` and
`npm run build`. Point it at a checkout elsewhere with `OMAN_DATA_DIR`.

| command | what |
| --- | --- |
| `npm test` | vitest — the contract check against the real synced data tree |
| `npm run typecheck` | `astro check` |
| `npm run build` | static build to `dist/` |
| `npm run check:glue` | post-build HTML guard (see CLAUDE.md) |

CI (`.github/workflows/test.yml`) runs all of the above on every push to
`main` and every PR, syncing via the shallow-clone path so it exercises the
same code path Cloudflare Pages does.

## Deploy

Cloudflare Pages, built from this repo's `main`. Dashboard setup (done by
hand, once):

| setting | value |
| --- | --- |
| build command | `node scripts/sync-data.mjs && npm run build` |
| build output directory | `dist` |
| node version | from `.node-version` (22.12.0) — Pages' default is too old for astro 7 |
| root directory | repo root |

The sync step has no sibling checkout on Pages, so it shallow-clones
oman-data at build time; that means **a data change in oman-data needs a
rebuild here to go live.** oman-data's refresh workflow calls a Pages deploy
hook (Settings → Builds & deployments → Deploy hooks) to trigger one — store
the hook URL as a secret in oman-data, never in this repo.

No live URL yet: it will be the generated `*.pages.dev` domain until the
custom domain is decided.
