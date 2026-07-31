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
- [ ] **Site URL is live.** At drafting time `omandata.dev` was not registered
      and not deployed. Confirm the real hostname and replace every occurrence
      here, including the signature line.
- [ ] **Dataset count re-verified.** The body says **9**. Re-check
      `/v1/datasets.json` for entries with `"stale": false` on the day you
      send. If a dataset has gone stale, either fix it or change the number —
      a stale catalog on the day the CDO opens the link undoes the whole point.
- [ ] **Signature filled.** `[phone]`, `[GitHub link]`, `[site link]` all
      replaced.
- [ ] **The April workshop reference is right.** MTCIT's Open Data team held an
      open data workshop at the Royal Academy of Management in April 2026,
      covering the national portal's role in automating the flow of data from
      entities (verified 2026-08-01). Re-check it before sending — getting a
      recipient's own event wrong is worse than omitting it. If in doubt,
      delete that sentence; the email works without it.

### Have ready if they open the data

- **`fuel_prices` has mixed provenance, disclosed per row** (`source` column:
  `archive-corroborated` 238, `subsidy-cap-freeze` 123, `archive-news-resolved`
  12, `archive-single-source` 8, `nss.gov.om` 3). No official machine-readable
  archive of the monthly announcements exists. This is also the single most
  useful thing the portals could fix, if they ask what would help.
- **`tourism` is 3–5 star hotels only**, per NCSI's published scope.
- **`climate_normals` is ERA5 reanalysis, not DGMET observations** — labelled
  as such in the dataset's notes.

---

**SEND FROM HERE ↓**

To: Chief Data Office / MTCIT (address verified per the checklist above)
Subject: A developer layer prototype on top of Oman's open data portals

السلام عليكم،

I'm Nasser Albusaidi, a software engineer in Muscat. I've been an admirer of
the Open Government Data Policy and the national portal, and I built something
I'd like to show your team: a working prototype of a developer layer on top of
the data Oman already publishes.

omandata.dev serves 9 datasets — eight from official Omani sources (NCSI, the
National Subsidy System, the Official Gazette), plus a 1991–2020 climate
baseline from ERA5 reanalysis that is labelled as such — as a versioned,
bilingual, statically-hosted JSON API. Every number is traceable back to the
official source file it came from, and freshness is flagged honestly when a
source pauses.

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
