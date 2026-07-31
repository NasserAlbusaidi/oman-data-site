import { expect, test } from "vitest";
import { previewFor } from "./preview";

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
