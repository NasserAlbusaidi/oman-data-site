# Email — Chief Data Office / MTCIT

**Draft. Do not send until every box below is ticked.** Short and deferential
by design — the goal is a conversation, not a pitch. Resist the urge to add
paragraphs.

## Pre-send checklist (EXECUTION gate)

- [ ] **Verify the recipient address on mtcit.gov.om before sending.** Do not
      guess it. If no Chief Data Office address is published, use the
      ministry's general contact with "attn: Chief Data Office" in the subject.
- [ ] **Recipient is genuinely ambiguous — decide deliberately.** As of
      2026-08-01 the Omanuna "Chief Data Office" page is offline (the whole
      Omanuna portal now redirects to gov.om), so the office's current
      institutional home is not confirmable from public sources. Two
      candidates:
      - **MTCIT's Open Data team** — owns the National Open Data Portal, the
        Open Government Data Policy, and the April workshop this email cites.
        Everything the body says lands with them. *Recommended primary.*
      - **NCSI** — the national statistics mandate (Royal Decree 40/2014), and
        the source behind most of the catalog. Worth a **separate** email in
        its own words, not a CC — the ask is different.
- [ ] **Site URL is live.** At drafting time `omandata.dev` was not registered;
      the site is now live at `oman-data-site.pages.dev` (direct upload).
      Confirm which hostname the email will use and replace every occurrence
      here, including the signature line.
- [ ] **The domain decision has to propagate to the site itself.** The hostname
      lives in one place — `site` in `astro.config.mjs` — and the curl examples
      and hreflang links derive from it. Change it there and rebuild *before*
      sending; this reader will run those commands. Verify:
      `grep -rn omandata.dev src dist` returns nothing after the rebuild.
- [ ] **Dataset count re-verified.** The body says **12**. Re-check
      `/v1/datasets.json` for entries with `"stale": false` on the day you
      send. If a dataset has gone stale, either fix it or change the number —
      a stale catalog on the day the CDO opens the link undoes the whole point.
- [ ] **Run the `fuel_prices` pipeline by hand the morning you send.**
      nss.gov.om is unreachable from GitHub-hosted runners (network-level, not
      a user-agent block), so it fails every scheduled refresh and ages into a
      stale flag on its own. Of all twelve, this is the one this reader is most
      likely to open.
- [ ] **`NasserAlbusaidi/oman-data` is public.** Verified PUBLIC on 2026-08-01 —
      this box guards the regression. The email offers to show the pipeline; a
      private repo makes the offer hollow.
- [ ] **Signature filled.** `[phone]`, `[GitHub link]`, `[site link]` all
      replaced.
- [ ] **The April workshop reference is right.** MTCIT's Open Data team held an
      open data workshop at the Royal Academy of Management in April 2026,
      covering the national portal's role in automating the flow of data from
      entities (verified 2026-08-01). Re-check it before sending — getting a
      recipient's own event wrong is worse than omitting it. If in doubt,
      delete that sentence; the email works without it.
- [ ] **After sending: record it on the `## Announced` line in the site repo's
      README** alongside the LinkedIn posts. That line is the project's
      definition of shipped.

### Have ready if they open the data

- **`fuel_prices` has mixed provenance, disclosed per row** — the `source`
  column, defined in `pipelines/fuel_prices/dataset.yaml`:
  `archive-corroborated` (238 rows — at least two independent records agree),
  `subsidy-cap-freeze` (123 — derived from the announced price cap, not observed
  month by month), `archive-news-resolved` (12 — the compilations disagreed and
  a dated primary record settled it), `archive-single-source` (8 — no second
  record retrievable), `nss.gov.om` (3 — read off the official NSS page, either
  the month currently shown or one captured by an earlier run). No official
  machine-readable archive of the monthly announcements exists. **This is also
  the single most useful thing the portals could fix, if they ask what would
  help** — and the body deliberately admits it rather than waiting to be caught.
- **`tourism` is 3–5 star hotels only**, per NCSI's published scope.
- **`climate_normals` is ERA5 reanalysis, not DGMET observations** — labelled
  as such in the dataset's notes.
- **data.gov.om does have an API** (Knoema, `api/1.0/data/raw`) and this
  project's pipelines use it. The body says "developer-facing" for that reason:
  it is keyed by opaque numeric dimension members and needs a client id. If they
  raise it, concede immediately — they know their own portal better than we do.

---

**SEND FROM HERE ↓**

To: Chief Data Office / MTCIT (address verified per the checklist above)
Subject: A developer layer prototype on top of Oman's open data portals

السلام عليكم،

I'm Nasser Albusaidi, a software engineer in Muscat. I've been an admirer of
the Open Government Data Policy and the national portal, and I built something
I'd like to show your team: a working prototype of a developer layer on top of
the data Oman already publishes.

omandata.dev serves 12 datasets — eleven from official Omani sources (NCSI, the
Ministry of Energy and Minerals, the National Subsidy System, Royal Oman Police
data via NCSI, the Official Gazette), plus a 1991–2020 climate baseline from
ERA5 reanalysis that is labelled as such — as a versioned, bilingual,
statically-hosted JSON API. Every number carries its provenance in the data
itself: most trace back to the official source file they came from, and where a
value had to be reconstructed rather than published — part of the fuel-price
history, for which no official machine-readable archive exists — the row says
so in its own source column. Freshness is flagged honestly when a source pauses.

It is deliberately a companion to the portals, not a critique: every dataset
names its source, carries its license, and the site states plainly that it is
unofficial and unaffiliated. I built it because your April workshop on the
portal's role in automating the flow of data from entities suggested this gap
is already on your agenda, and a concrete prototype seemed more useful than a
slide deck.

I'd welcome the chance to walk your team through it — what worked, what the
portals could expose to make this trivial for any developer, and where I'd be
glad to help.

شاكرًا لكم حسن اطلاعكم،
ناصر البوسعيدي
[phone] · [GitHub link] · [site link]
