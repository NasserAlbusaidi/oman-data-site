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

**Live now at <https://oman-data-site.pages.dev>** — a wrangler direct-upload
deploy (`npm run sync && npm run build && npx wrangler pages deploy dist
--project-name oman-data-site --branch main`). Direct-upload projects have no
git builds and therefore no deploy hooks, so redeploys are manual until the
project is switched to git-connected builds.

The target setup is Cloudflare Pages built from this repo's `main`. A
direct-upload project cannot be converted: delete `oman-data-site` in the
dashboard first, then recreate it git-connected **with the same project name**
(the `pages.dev` URL survives). Dashboard setup (done by hand, once):

| setting | value |
| --- | --- |
| build command | `node scripts/sync-data.mjs && npm run build` |
| build output directory | `dist` |
| node version | from `.node-version` (22.12.0) — Pages' default is too old for astro 7 |
| root directory | repo root |

The sync step has no sibling checkout on Pages, so it shallow-clones
oman-data at build time; that means **a data change in oman-data needs a
rebuild here to go live.** oman-data's refresh workflows call a Pages deploy
hook (Settings → Builds & deployments → Deploy hooks) to trigger one. Store
that hook URL as the repository secret **`CF_PAGES_DEPLOY_HOOK` in the
oman-data repo** — that exact name is what `refresh-monthly.yml`,
`refresh-quarterly.yml` and `refresh-annual.yml` read; never put it in this
repo. If the secret is absent the refresh logs a skip, and if the hook call
fails it logs a warning rather than failing the data refresh.

The hostname the site prints in its `curl` examples and hreflang links comes
from `site` in `astro.config.mjs` — change the domain there and rebuild;
there is nothing else to edit.

Verify after a deploy (replace the host with the live one):

```sh
curl -s https://<host>/v1/datasets.json | head -c 200
curl -sI https://<host>/v1/datasets.json | grep -i access-control-allow-origin
```

The first must return the catalog JSON; the second must show
`access-control-allow-origin: *` — without it the API is unusable from a
browser, which is most of the point.

The live URL stays `oman-data-site.pages.dev` until the custom domain is
decided; note `astro.config.mjs` currently sets `site` to
`https://omandata.dev`, so canonical/hreflang URLs and the printed `curl`
examples point at the target domain, not the `pages.dev` host. Flip that one
line before announcing if the announcement will link to `pages.dev`.
