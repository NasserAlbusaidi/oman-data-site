# LinkedIn — English

**Draft. Do not post until every box below is ticked.** Nasser edits the voice
before posting; this is a starting point, not copy to paste blindly.

## Pre-post checklist (EXECUTION gate)

- [ ] **Site URL is live.** The body says `omandata.dev`. At drafting time that
      domain was **not registered and not deployed** — the site had no live URL
      at all (`README.md`: "No live URL yet"). Confirm the real hostname
      (custom domain or the `*.pages.dev` one) and replace **every** occurrence
      in this file, including the link line at the bottom.
- [ ] **Dataset count re-verified.** The body says **9**. Re-run
      `curl -s https://<site>/v1/datasets.json` and count entries with
      `"stale": false`. Nine were fresh on 2026-07-31. If fewer than 8 are
      fresh, **do not post** — fix the pipeline first.
- [ ] **Links filled.** Both `[link: …]` placeholders replaced with real URLs.
      A post with a placeholder in it is the whole first impression, wasted.
- [ ] **The source-mix line still matches reality.** 8 of the 9 datasets come
      from official Omani sources; `climate_normals` is ERA5 reanalysis (via
      Open-Meteo), not an official Omani observation series. If the catalog
      changes, change the sentence.

### Caveats to have ready (if a journalist or engineer asks)

- **`fuel_prices` has mixed provenance, disclosed per row.** Every row carries
  a `source` column: `archive-corroborated` (238 rows, two independent records
  agree), `subsidy-cap-freeze` (123 rows, derived from the announced price cap
  rather than observed month-by-month), `archive-news-resolved` (12),
  `archive-single-source` (8), `nss.gov.om` (3, scraped live). No official
  machine-readable archive of the monthly announcements exists — that is why.
  Say this plainly if asked; it is a strength of the dataset, not a hole in it.
- **`tourism` covers 3–5 star hotels only** — that is the scope NCSI publishes,
  not all accommodation. Do not let a comment turn it into "Oman's tourism
  numbers".
- **The current fuel series is flat** because the price cap has held since
  Dec 2021, not because the pipeline is broken.

---

**PASTE FROM HERE ↓**

For the past few weeks I've been building the developer layer Oman's open
data doesn't have yet: omandata.dev

Oman publishes real statistics — population, prices, trade, tourism, fuel,
electricity, road safety — but as files, not as infrastructure. No API, no
bulk access, no versioning. So I built the prototype of that layer on top of
the official sources:

- 9 datasets, normalized into tidy bilingual (AR/EN) tables. Eight come from
  official Omani sources (NCSI, the National Subsidy System, the Official
  Gazette); the ninth is a 1991–2020 climate baseline computed from ERA5
  reanalysis, and it is labelled as exactly that.
- A static JSON API — /v1/, CORS open, no keys
- Every number traceable: JSON → git commit → raw source snapshot → official URL
- Honest freshness: anything past its update window is flagged stale, never
  silently outdated
- CSV + Parquet downloads, full pipeline open source (MIT for the code; each
  dataset keeps its source's own license)

It's a companion to the national portals, not a critique — every dataset names
its official source and keeps its license, and none of this is affiliated with
any government entity. If you build something with it, or want a dataset
added, the repo is open.

[link: site] · [link: GitHub repo]
