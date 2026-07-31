# LinkedIn — Arabic

**Draft. Do not post until every box below is ticked.** Post this one **first**
— the audience that matters most reads Arabic. Nasser edits the voice before
posting.

## Pre-post checklist (EXECUTION gate)

- [ ] **Site URL is live.** The body says `omandata.dev`. At drafting time that
      domain was **not registered and not deployed** — the site had no live URL
      at all (`README.md`: "No live URL yet"). Confirm the real hostname and
      replace **every** occurrence in this file, including the link line.
- [ ] **The domain decision has to propagate to the site itself.** `omandata.dev`
      is hardcoded as `site` in `astro.config.mjs` and is what the built
      per-dataset pages print in their `curl` examples. Change it there and
      rebuild *before* posting, or the first URL a visitor copies will 404.
- [ ] **Dataset count re-verified.** The body says **٩**. Re-run
      `curl -s https://<site>/v1/datasets.json` and count entries with
      `"stale": false`. Nine were fresh on 2026-07-31. If fewer than 8 are
      fresh, **do not post**.
- [ ] **Run the `fuel_prices` pipeline by hand the morning of the post.**
      nss.gov.om is unreachable from GitHub-hosted runners, so it fails every
      scheduled refresh and will silently age into a stale flag — on the dataset
      people click first. Run it locally, commit, let the site rebuild.
- [ ] **`NasserAlbusaidi/oman-data` is public.** Verified PUBLIC on 2026-08-01 —
      this box guards the regression. A private repo makes the closing line
      (المستودع مفتوح) a lie and a 404.
- [ ] **Links filled.** Both `[رابط …]` placeholders replaced with real URLs.
- [ ] **The source-mix sentence still matches reality.** 8 of the 9 are from
      official Omani sources; `climate_normals` is ERA5 reanalysis, and the
      Arabic body says so. Keep it that way.
- [ ] **RTL check before posting.** Paste into the LinkedIn composer and look
      at it: the Latin fragments (`omandata.dev`, `/v1/`, `JSON`, `CSV`,
      `Parquet`, `ERA5`, `MIT`, `git`) must not scramble the line order. Fix by
      re-typing around them if they do.
- [ ] **After posting: add the `## Announced` line to the site repo's README** —
      the date, and where it was posted. That line is this project's definition
      of shipped.

### Caveats to have ready (if a journalist or engineer asks)

- **`fuel_prices` has mixed provenance, disclosed per row.** Every row carries a
  `source` column, per `pipelines/fuel_prices/dataset.yaml`:
  `archive-corroborated` (238 rows — at least two independent records agree),
  `subsidy-cap-freeze` (123 — derived from the announced price cap, not observed
  month by month), `archive-news-resolved` (12 — the compilations disagreed and
  a dated primary record settled it), `archive-single-source` (8 — no second
  record was retrievable), `nss.gov.om` (3 — read off the official NSS page,
  either the month currently shown or one captured by an earlier run). No
  official machine-readable archive of the monthly announcements exists — that
  is why. Say it plainly; it is the honest part of the dataset.
- **`tourism` covers 3–5 star hotels only** (نزلاء الفنادق المصنفة ٣–٥ نجوم),
  which is NCSI's published scope — not all accommodation.
- **The fuel series is flat** because the price cap has held since Dec 2021,
  not because the pipeline broke.
- **If someone says data.gov.om already has an API: they are right, and the post
  says "موجّهة للمطوّرين" for that reason.** It is a Knoema portal API keyed by
  opaque numeric dimension members, needing a client id and cube queries — this
  project's own pipelines use it. Concede the point, keep the distinction.

---

**PASTE FROM HERE ↓**

خلال الأسابيع الماضية كنت أبني طبقة برمجية للمطوّرين تفتقدها البيانات
المفتوحة في عُمان: omandata.dev

عُمان تنشر إحصاءات حقيقية — السكان، والأسعار، والتجارة، والسياحة، والوقود،
والكهرباء، وحوادث المرور — لكن كملفات، لا كبنية تحتية: لا واجهة برمجية موجّهة
للمطوّرين، ولا لقطات شاملة محفوظة بإصدارات. فبنيت نموذجًا أوليًا لتلك الطبقة
فوق المصادر الرسمية نفسها:

- ٩ مجموعات بيانات منظمة في جداول ثنائية اللغة (عربي/إنجليزي). ثمانٍ منها من
  مصادر رسمية عُمانية (المركز الوطني للإحصاء والمعلومات، ووزارة الطاقة
  والمعادن، ونظام الدعم الوطني، وبيانات شرطة عُمان السلطانية عبر المركز
  الوطني، والجريدة الرسمية)، والتاسعة معدلات مناخية ١٩٩١–٢٠٢٠ محسوبة من
  بيانات إعادة التحليل ERA5 — وهي موسومة بذلك صراحةً.
- واجهة JSON ثابتة — ‎/v1/‎ مفتوحة للجميع دون مفاتيح
- كل رقم يحمل مصدره داخل البيانات نفسها: من ملف JSON إلى إصداره في git إلى
  نسخة المصدر المحفوظة. ومعظم الأرقام تعود إلى ملف رسمي مباشرةً، وحيثما
  أُعيد بناء رقم بدلًا من نشره — كجزء من تاريخ أسعار الوقود الذي لا ينشره
  أحد بصيغة قابلة للقراءة آليًا — فالصف نفسه يصرّح بذلك.
- شفافية في تحديث البيانات: ما تجاوز نافذة تحديثه يُعلَّم "متقادمًا" ولا
  يُترك صامتًا
- تنزيلات CSV وParquet، ومسار المعالجة بالكامل مفتوح المصدر (رخصة MIT
  للشيفرة، وكل مجموعة بيانات تبقى تحت رخصة مصدرها)

المشروع مكمِّل للبوابات الوطنية لا بديل عنها، وليس جهة رسمية ولا تابعًا لأي
جهة حكومية — كل مجموعة بيانات تنسب مصدرها الرسمي وتحتفظ برخصته. إن بنيت شيئًا
فوقه أو أردت إضافة مجموعة، فالمستودع مفتوح.

[رابط الموقع] · [رابط GitHub]
