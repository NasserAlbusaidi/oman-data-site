# LinkedIn — English

**Draft. Do not post until every box below is ticked.** Nasser edits the voice
before posting; this is a starting point, not copy to paste blindly.

## Pre-post checklist (EXECUTION gate)

- [ ] **Site URL is live.** The body says `omandata.dev`. At drafting time
      `omandata.dev` was not registered; the site is now live at
      `oman-data-site.pages.dev` (direct upload). Confirm which hostname the
      post will use — the custom domain or the `*.pages.dev` one — and replace
      **every** occurrence in this file, including the link line at the bottom.
- [ ] **The domain decision has to propagate to the site itself.** The hostname
      lives in one place — `site` in `astro.config.mjs` — and the curl examples
      and hreflang links derive from it. Change it there and rebuild *before*
      posting, otherwise the first thing a visitor copies is a URL that 404s.
      Verify: `grep -rn omandata.dev src dist` returns nothing after the rebuild.
- [ ] **Dataset count re-verified.** The body says **12**. Re-run
      `curl -s https://<site>/v1/datasets.json` and count entries with
      `"stale": false`. All twelve were fresh on 2026-08-05. If fewer than 11
      are fresh, **do not post** — fix the pipeline first.
- [ ] **Run the `fuel_prices` pipeline by hand the morning of the post.**
      nss.gov.om is unreachable from GitHub-hosted runners (network-level block;
      it answers fine from a Muscat connection), so this dataset fails every
      scheduled refresh and will silently age into a stale flag. It is also the
      dataset people will click first. Run it locally, commit, let the site
      rebuild.
- [ ] **`NasserAlbusaidi/oman-data` is public.** Verified PUBLIC on 2026-08-01 —
      this box guards the regression, not the current state. A private repo turns
      the post's closing line into a 404.
- [ ] **Links filled.** Both `[link: …]` placeholders replaced with real URLs.
      A post with a placeholder in it is the whole first impression, wasted.
- [ ] **The source-mix line still matches reality.** 11 of the 12 datasets come
      from official Omani sources; `climate_normals` is ERA5 reanalysis (via
      Open-Meteo), not an official Omani observation series. If the catalog
      changes, change the sentence.
- [ ] **After posting: add the `## Announced` line to the site repo's README** —
      the date, and where it was posted. That line is this project's definition
      of shipped; nothing is shipped until it exists.

### Caveats to have ready (if a journalist or engineer asks)

- **`fuel_prices` has mixed provenance, disclosed per row.** Every row carries a
  `source` column, and the values mean what `pipelines/fuel_prices/dataset.yaml`
  says they mean: `archive-corroborated` (238 rows — at least two independent
  records agree, either both compilations or one compilation plus a dated press
  report), `subsidy-cap-freeze` (123 rows — derived from the announced price cap,
  not observed month by month), `archive-news-resolved` (12 — the compilations
  disagreed and a dated primary record settled it), `archive-single-source` (8 —
  no second record was retrievable), `nss.gov.om` (3 — read off the official NSS
  page, either the month currently shown or a month captured by an earlier run).
  No official machine-readable archive of the monthly announcements exists —
  that is why. Say this plainly if asked; it is a strength of the dataset, not a
  hole in it.
- **`tourism` covers 3–5 star hotels only** — that is the scope NCSI publishes,
  not all accommodation. Do not let a comment turn it into "Oman's tourism
  numbers".
- **The current fuel series is flat** because the price cap has held since
  Dec 2021, not because the pipeline is broken.
- **If someone points out data.gov.om has an API: they are right, and the post
  says "developer-facing" for that reason.** It is a Knoema portal API keyed by
  opaque numeric dimension members, needing a client id and cube queries — this
  project's own pipelines use it (`oman_data/knoema.py`). That is a portal's
  internal API, not something a developer can build against from the docs.
  Concede the point, keep the distinction.

---

**PASTE FROM HERE ↓**

For the past few weeks I've been building the developer layer Oman's open
data doesn't have yet: omandata.dev

Oman publishes real statistics — population, consumer and producer prices, GDP,
trade, tourism, fuel, electricity, oil and gas, road safety — but as files, not
as infrastructure. No developer-facing API, no versioned bulk snapshots. So I
built the prototype of that layer on top of the official sources:

- 12 datasets, normalized into tidy bilingual (AR/EN) tables. Eleven come from
  official Omani sources (NCSI, the Ministry of Energy and Minerals, the
  National Subsidy System, Royal Oman Police data via NCSI, the Official
  Gazette); the twelfth is a 1991–2020 climate baseline computed from ERA5
  reanalysis, and it is labelled as exactly that.
- A static JSON API — /v1/, CORS open, no keys
- Every number carries its provenance in the data: JSON → git commit →
  archived source snapshot. Most trace straight to an official source file, and
  where a number had to be reconstructed rather than published — part of the
  fuel-price history, for which no official machine-readable archive exists —
  the row says so itself.
- Honest freshness: anything past its update window is flagged stale, never
  silently outdated
- CSV + Parquet downloads, full pipeline open source (MIT for the code; each
  dataset keeps its source's own license)

It's a companion to the national portals, not a critique — every dataset names
its official source and keeps its license, and none of this is affiliated with
any government entity. If you build something with it, or want a dataset
added, the repo is open.

[link: site] · [link: GitHub repo]
