# LinkedIn — Arabic

**Draft. Do not post until every box below is ticked.** Post this one **first**
— the audience that matters most reads Arabic. Nasser edits the voice before
posting.

## Pre-post checklist (EXECUTION gate)

- [ ] **Site URL is live.** The body says `omandata.dev`. At drafting time that
      domain was **not registered and not deployed** — the site had no live URL
      at all (`README.md`: "No live URL yet"). Confirm the real hostname and
      replace **every** occurrence in this file, including the link line.
- [ ] **Dataset count re-verified.** The body says **٩**. Re-run
      `curl -s https://<site>/v1/datasets.json` and count entries with
      `"stale": false`. Nine were fresh on 2026-07-31. If fewer than 8 are
      fresh, **do not post**.
- [ ] **Links filled.** Both `[رابط …]` placeholders replaced with real URLs.
- [ ] **The source-mix sentence still matches reality.** 8 of the 9 are from
      official Omani sources; `climate_normals` is ERA5 reanalysis, and the
      Arabic body says so. Keep it that way.
- [ ] **RTL check before posting.** Paste into the LinkedIn composer and look
      at it: the Latin fragments (`omandata.dev`, `/v1/`, `JSON`, `CSV`,
      `Parquet`, `ERA5`, `MIT`) must not scramble the line order. Fix by
      re-typing around them if they do.

### Caveats to have ready (if a journalist or engineer asks)

- **`fuel_prices` has mixed provenance, disclosed per row.** Every row carries
  a `source` column: `archive-corroborated` (238 rows), `subsidy-cap-freeze`
  (123 rows, derived from the announced price cap, not observed monthly),
  `archive-news-resolved` (12), `archive-single-source` (8), `nss.gov.om` (3).
  No official machine-readable archive of the monthly announcements exists —
  that is why. Say it plainly; it is the honest part of the dataset.
- **`tourism` covers 3–5 star hotels only** (النزلاء في الفنادق المصنفة ٣–٥
  نجوم), which is NCSI's published scope — not all accommodation.
- **The fuel series is flat** because the price cap has held since Dec 2021,
  not because the pipeline broke.

---

**PASTE FROM HERE ↓**

خلال الأسابيع الماضية كنت أبني الطبقة التطويرية التي تفتقدها البيانات
المفتوحة في عُمان: omandata.dev

عُمان تنشر إحصاءات حقيقية — السكان، والأسعار، والتجارة، والسياحة، والوقود،
والكهرباء، وحوادث المرور — لكن كملفات، لا كبنية تحتية: لا واجهة برمجية، ولا
تنزيل شامل، ولا إصدارات. فبنيت نموذجًا أوليًا لتلك الطبقة فوق المصادر
الرسمية نفسها:

- ٩ مجموعات بيانات منظمة في جداول ثنائية اللغة (عربي/إنجليزي). ثماني منها من
  مصادر رسمية عُمانية (المركز الوطني للإحصاء والمعلومات، ونظام الدعم الوطني،
  والجريدة الرسمية)، والتاسعة معدلات مناخية ١٩٩١–٢٠٢٠ محسوبة من بيانات
  إعادة التحليل ERA5 — وهي موسومة بذلك صراحةً.
- واجهة JSON ثابتة — ‎/v1/‎ مفتوحة للجميع دون مفاتيح
- كل رقم قابل للتتبع: من ملف JSON إلى إصداره في git إلى نسخة المصدر الخام
  المحفوظة إلى رابط المصدر الرسمي
- صراحة في الحداثة: ما تجاوز نافذة تحديثه يُعلَّم "متقادمًا" ولا يُترك صامتًا
- تنزيلات CSV وParquet، وخط الأنابيب كامل مفتوح المصدر (رخصة MIT للشيفرة،
  وكل مجموعة بيانات تبقى تحت رخصة مصدرها)

المشروع مكمِّل للبوابات الوطنية لا بديل عنها، وليس جهة رسمية ولا تابعًا لأي
جهة حكومية — كل مجموعة بيانات تنسب مصدرها الرسمي وتحتفظ برخصته. إن بنيت شيئًا
فوقه أو أردت إضافة مجموعة، المستودع مفتوح.

[رابط الموقع] · [رابط GitHub]
