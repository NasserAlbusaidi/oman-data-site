# oman-data-site

Bilingual (AR/EN) docs site + static JSON API host for
[oman-data](https://github.com/NasserAlbusaidi/oman-data) — the unofficial
developer layer for Oman's open data.

Build pulls `api/v1/` from the oman-data repo (sibling checkout or shallow
clone), renders a catalog + per-dataset pages, and deploys to Cloudflare
Pages with CORS open on `/v1/*`.

Code MIT. Data: license of each official source. Not affiliated with any
government entity.
