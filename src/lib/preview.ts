export interface PreviewSeries {
  label_ar: string;
  label_en: string;
  points: { t: string; v: number }[];
}

type Row = Record<string, string | number>;

function series(
  rows: Row[],
  tKey: string,
  vKey: string,
  label_ar: string,
  label_en: string,
): PreviewSeries | null {
  const points = rows
    .map((r) => ({ t: String(r[tKey]), v: Number(r[vKey]) }))
    .sort((a, b) => a.t.localeCompare(b.t));
  return points.length >= 2 ? { label_ar, label_en, points } : null;
}

function sumBy(rows: Row[], tKey: string, vKey: string): Row[] {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[tKey]);
    totals.set(k, (totals.get(k) ?? 0) + Number(r[vKey]));
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
      .map((r) => ({ t: String(r.month), v: Number(r.value) }))
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
