import { expect, test } from "vitest";
import { loadLatest } from "./data";
import { previewFor } from "./preview";

// Every extractor keys off column names and filter values owned by the other
// repo (`group === "general"`, `flow === "exports"`, `fuel_type === "m91"`…).
// A rename there does not fail any fixture test — it just silently degrades
// the page to table-only. This runs the extractors against the real synced
// tree, which is the only place that drift shows up.
const CHARTABLE = [
  "cpi",
  "population",
  "trade",
  "tourism",
  "electricity",
  "traffic_accidents",
  "fuel_prices",
  "climate_normals",
  "gdp",
  "oil_gas",
  "ppi",
];

test.each(CHARTABLE)("%s charts from the real synced data", (id) => {
  const series = previewFor(id, loadLatest(id).data);
  expect(series, `${id} lost its preview — check the extractor's column names`)
    .not.toBeNull();
  expect(series!.points.length).toBeGreaterThanOrEqual(2);
  expect(series!.points.every((p) => Number.isFinite(p.v))).toBe(true);
});

test("admin_geography is the reference dataset with no chart", () => {
  expect(previewFor("admin_geography", loadLatest("admin_geography").data))
    .toBeNull();
});

test("cpi extracts the general series in month order", () => {
  const rows = [
    { month: "2026-02", group: "food", index: 110 },
    { month: "2026-02", group: "general", index: 104 },
    { month: "2026-01", group: "general", index: 103 },
  ];
  const s = previewFor("cpi", rows);
  expect(s?.points).toEqual([
    { t: "2026-01", v: 103 },
    { t: "2026-02", v: 104 },
  ]);
  expect(s?.label_en).toContain("general");
});

test("population sums governorates per year", () => {
  const rows = [
    { year: 2023, governorate_code: "OM-MA", population: 100 },
    { year: 2023, governorate_code: "OM-BJ", population: 50 },
    { year: 2024, governorate_code: "OM-MA", population: 120 },
  ];
  expect(previewFor("population", rows)?.points).toEqual([
    { t: "2023", v: 150 },
    { t: "2024", v: 120 },
  ]);
});

test("climate normals sort months numerically, not lexicographically", () => {
  const rows = [
    { station: "muscat", variable: "tmax_c", month: 10, value: 34 },
    { station: "muscat", variable: "tmax_c", month: 2, value: 26 },
    { station: "salalah", variable: "tmax_c", month: 1, value: 27 },
  ];
  expect(previewFor("climate_normals", rows)?.points).toEqual([
    { t: "2", v: 26 },
    { t: "10", v: 34 },
  ]);
});

test("reference datasets get no chart", () => {
  expect(previewFor("admin_geography", [])).toBeNull();
  expect(previewFor("unknown_future_dataset", [])).toBeNull();
});

// Upstream `exports` already includes re-exports, so a preview that summed the
// flows would double-count. Only the exports rows may survive the extractor.
test("trade keeps exports only, never summing the flows", () => {
  const rows = [
    { month: "2026-01", flow: "exports", value_omr_mn: 100 },
    { month: "2026-01", flow: "imports", value_omr_mn: 70 },
    { month: "2026-01", flow: "re_exports", value_omr_mn: 30 },
    { month: "2026-02", flow: "exports", value_omr_mn: 120 },
    { month: "2026-02", flow: "imports", value_omr_mn: 80 },
  ];
  expect(previewFor("trade", rows)?.points).toEqual([
    { t: "2026-01", v: 100 },
    { t: "2026-02", v: 120 },
  ]);
});

test("traffic_accidents keeps the accidents metric only", () => {
  const rows = [
    { year: 2024, metric: "accidents", count: 1000 },
    { year: 2024, metric: "deaths", count: 500 },
    { year: 2025, metric: "accidents", count: 900 },
    { year: 2025, metric: "injuries", count: 300 },
  ];
  expect(previewFor("traffic_accidents", rows)?.points).toEqual([
    { t: "2024", v: 1000 },
    { t: "2025", v: 900 },
  ]);
});

test("fuel_prices charts m91 in baisa", () => {
  const rows = [
    { month: "2026-01", fuel_type: "m91", price_baisa: 220, source: "nss" },
    { month: "2026-01", fuel_type: "m95", price_baisa: 230, source: "nss" },
    { month: "2026-02", fuel_type: "m91", price_baisa: 225, source: "nss" },
    { month: "2026-02", fuel_type: "diesel", price_baisa: 240, source: "nss" },
  ];
  const s = previewFor("fuel_prices", rows);
  expect(s?.points).toEqual([
    { t: "2026-01", v: 220 },
    { t: "2026-02", v: 225 },
  ]);
  expect(s?.label_en).toContain("M91");
});

test("tourism charts occupancy_pct, not guests or revenue", () => {
  const rows = [
    { month: "2026-01", guests: 150000, occupancy_pct: 60.5, revenue_omr_mn: 13 },
    { month: "2026-02", guests: 160000, occupancy_pct: 62.5, revenue_omr_mn: 14 },
  ];
  expect(previewFor("tourism", rows)?.points).toEqual([
    { t: "2026-01", v: 60.5 },
    { t: "2026-02", v: 62.5 },
  ]);
});

test("electricity charts production_gwh by year, not consumption", () => {
  const rows = [
    { year: 2024, production_gwh: 48000, consumption_gwh: 42000 },
    { year: 2025, production_gwh: 50973.5, consumption_gwh: 45033.1 },
  ];
  expect(previewFor("electricity", rows)?.points).toEqual([
    { t: "2024", v: 48000 },
    { t: "2025", v: 50973.5 },
  ]);
});

// Current and constant prices measure the same aggregate two different ways;
// one axis carrying both would draw a fictional series, and only the current
// basis reaches the newest year at all.
test("gdp charts current prices only, never mixing the two bases", () => {
  const rows = [
    { year: 2023, price_basis: "constant", gdp_mn_omr: 37674.5 },
    { year: 2023, price_basis: "current", gdp_mn_omr: 39432.1 },
    { year: 2024, price_basis: "current", gdp_mn_omr: 41194.3 },
  ];
  const s = previewFor("gdp", rows);
  expect(s?.points).toEqual([
    { t: "2023", v: 39432.1 },
    { t: "2024", v: 41194.3 },
  ]);
  expect(s?.label_en).toContain("current");
});

// The four columns span 82 to 1.9e6; only one may be picked, and it must be
// the production series the labels name.
test("oil_gas charts crude production, not price or gas", () => {
  const rows = [
    {
      year: 2022,
      crude_production_kbbl_day: 1063.8,
      crude_exports_kbbl_day: 872.4,
      crude_price_usd_bbl: 94.6,
      gas_production_mn_scf: 1841000,
    },
    {
      year: 2023,
      crude_production_kbbl_day: 1048.7,
      crude_exports_kbbl_day: 850.2,
      crude_price_usd_bbl: 82.3,
      gas_production_mn_scf: 1908026.7,
    },
  ];
  const s = previewFor("oil_gas", rows);
  expect(s?.points).toEqual([
    { t: "2022", v: 1063.8 },
    { t: "2023", v: 1048.7 },
  ]);
  expect(s?.label_en).toContain("Crude oil production");
});

// Quarter labels are strings, not dates. They sort chronologically under plain
// string comparison — including across a year boundary, which is the case that
// would break if anyone "fixed" this by parsing them.
test("ppi keeps the general non-oil group and sorts quarters chronologically", () => {
  const rows = [
    { quarter: "2019Q1", group: "general_nonoil", index: 99.1 },
    { quarter: "2018Q4", group: "general_nonoil", index: 98.4 },
    { quarter: "2018Q4", group: "manufacturing", index: 101.7 },
    { quarter: "2019Q1", group: "water", index: 97.2 },
  ];
  const s = previewFor("ppi", rows);
  expect(s?.points).toEqual([
    { t: "2018Q4", v: 98.4 },
    { t: "2019Q1", v: 99.1 },
  ]);
  expect(s?.label_en).toContain("non-oil");
});

// A NaN would reach the SVG path as "M5.0 NaN" and blank the chart silently.
test("non-finite values are dropped, never charted as NaN", () => {
  const dirty = [
    { month: "2026-01", group: "general", index: 103 },
    { month: "2026-02", group: "general", index: null as unknown as number },
    { month: "2026-03", group: "general", index: "n/a" },
    { month: "2026-04", group: "general", index: 105 },
  ];
  const s = previewFor("cpi", dirty);
  expect(s?.points).toEqual([
    { t: "2026-01", v: 103 },
    { t: "2026-04", v: 105 },
  ]);
  expect(s?.points.every((p) => Number.isFinite(p.v))).toBe(true);

  // Degrade to table-only rather than draw a one-point line.
  expect(
    previewFor("cpi", [
      { month: "2026-01", group: "general", index: 103 },
      { month: "2026-02", group: "general", index: "" },
    ]),
  ).toBeNull();
});

// Number(null) is 0, so a summed year would silently under-count instead of
// going NaN. The whole year must drop, not report a wrong total.
test("a null member poisons its summed year instead of under-counting", () => {
  const rows = [
    { year: 2023, governorate_code: "OM-MA", population: 100 },
    { year: 2023, governorate_code: "OM-BJ", population: null as unknown as number },
    { year: 2024, governorate_code: "OM-MA", population: 120 },
    { year: 2025, governorate_code: "OM-MA", population: 130 },
  ];
  const s = previewFor("population", rows);
  expect(s?.points).toEqual([
    { t: "2024", v: 120 },
    { t: "2025", v: 130 },
  ]);
});

test("climate normals drop non-finite readings too", () => {
  const rows = [
    { station: "muscat", variable: "tmax_c", month: 1, value: 25 },
    { station: "muscat", variable: "tmax_c", month: 2, value: null as unknown as number },
    { station: "muscat", variable: "tmax_c", month: 3, value: 30 },
  ];
  expect(previewFor("climate_normals", rows)?.points).toEqual([
    { t: "1", v: 25 },
    { t: "3", v: 30 },
  ]);
});
