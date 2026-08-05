export interface PreviewSeries {
  label_ar: string;
  label_en: string;
  points: { t: string; v: number }[];
}

type Row = Record<string, string | number>;

/**
 * Number() at the boundary, but blank-ish input is missing data, not zero:
 * Number(null) and Number("") are both 0, which would chart a hole as a real
 * reading. Everything non-finite is dropped by the callers below.
 */
function num(v: unknown): number {
  if (v === null || v === undefined || v === "") return NaN;
  return Number(v);
}

function series(
  rows: Row[],
  tKey: string,
  vKey: string,
  label_ar: string,
  label_en: string,
): PreviewSeries | null {
  const points = rows
    .map((r) => ({ t: String(r[tKey]), v: num(r[vKey]) }))
    // Drop before the length check: a NaN would reach the SVG as "M5.0 NaN"
    // and blank the whole path. Too few real points means table-only.
    .filter((p) => Number.isFinite(p.v))
    .sort((a, b) => a.t.localeCompare(b.t));
  return points.length >= 2 ? { label_ar, label_en, points } : null;
}

function sumBy(rows: Row[], tKey: string, vKey: string): Row[] {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[tKey]);
    // NaN propagates through +, so one missing member poisons its whole group
    // and series() drops it. A partial sum would be a confidently wrong total.
    totals.set(k, (totals.get(k) ?? 0) + num(r[vKey]));
  }
  return [...totals].map(([t, v]) => ({ [tKey]: t, [vKey]: v }));
}

const EXTRACTORS: Record<string, (rows: Row[]) => PreviewSeries | null> = {
  cpi: (rows) =>
    series(
      rows.filter((r) => r.group === "general"),
      "month",
      "index",
      "الرقم القياسي العام (2018=100)",
      "CPI, general (2018=100)",
    ),
  ppi: (rows) =>
    series(
      rows.filter((r) => r.group === "general_nonoil"),
      // Quarter labels ("2018Q1") are not Date-parseable, but they do sort
      // chronologically as plain strings, so series()' localeCompare is already
      // correct — nothing here should try to parse them into dates.
      "quarter",
      "index",
      "الرقم القياسي العام لأسعار المنتجين — غير النفطي (2018=100)",
      "PPI, general non-oil (2018=100)",
    ),
  population: (rows) =>
    series(
      sumBy(rows, "year", "population"),
      "year",
      "population",
      "إجمالي السكان",
      "Total population",
    ),
  fuel_prices: (rows) =>
    series(
      rows.filter((r) => r.fuel_type === "m91"),
      "month",
      "price_baisa",
      "بنزين ٩١ (بيسة/لتر)",
      "M91 petrol (baisa/litre)",
    ),
  trade: (rows) =>
    series(
      // exports already includes re_exports upstream, so the flows must never
      // be summed or stacked — that would double-count the re-exported goods.
      rows.filter((r) => r.flow === "exports"),
      "month",
      "value_omr_mn",
      "الصادرات (مليون ر.ع)",
      "Exports (OMR mn)",
    ),
  tourism: (rows) =>
    series(
      rows,
      "month",
      "occupancy_pct",
      "نسبة الإشغال الفندقي ٪",
      "Hotel occupancy %",
    ),
  electricity: (rows) =>
    series(
      rows,
      "year",
      "production_gwh",
      "إنتاج الكهرباء (جيجاواط·ساعة)",
      "Electricity production (GWh)",
    ),
  gdp: (rows) =>
    series(
      // Current prices only. Current and constant are two different measures of
      // the same aggregate, so charting both as one series would be nonsense —
      // and only current prices carry the headline 2024 figure.
      rows.filter((r) => r.price_basis === "current"),
      "year",
      "gdp_mn_omr",
      "الناتج المحلي الإجمالي بالأسعار الجارية (مليون ر.ع)",
      "GDP at market prices, current (OMR mn)",
    ),
  oil_gas: (rows) =>
    series(
      // One column, deliberately: the four measures span 82 (USD/bbl) to 1.9e6
      // (MNSCF), so a shared axis pins three of them flat on the baseline.
      rows,
      "year",
      "crude_production_kbbl_day",
      "متوسط الإنتاج اليومي من النفط الخام (ألف برميل/يوم)",
      "Crude oil production (thousand bbl/day)",
    ),
  traffic_accidents: (rows) =>
    series(
      rows.filter((r) => r.metric === "accidents"),
      "year",
      "count",
      "حوادث المرور سنويًا",
      "Traffic accidents per year",
    ),
  climate_normals: (rows) => {
    // month is an int 1–12: sort numerically, not lexicographically
    const points = rows
      .filter((r) => r.station === "muscat" && r.variable === "tmax_c")
      .map((r) => ({ t: String(r.month), v: num(r.value) }))
      .filter((p) => Number.isFinite(p.v))
      .sort((a, b) => Number(a.t) - Number(b.t));
    return points.length >= 2
      ? {
          label_ar: "مسقط — متوسط العظمى الشهري (°م)",
          label_en: "Muscat — mean daily max by month (°C)",
          points,
        }
      : null;
  },
};

export function previewFor(id: string, rows: Row[]): PreviewSeries | null {
  const extract = EXTRACTORS[id];
  return extract ? extract(rows) : null;
}
