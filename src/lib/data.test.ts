import { expect, test } from "vitest";
import { loadCatalog, loadLatest } from "./data";

test("catalog loads and has bilingual entries", () => {
  const catalog = loadCatalog();
  expect(catalog.datasets.length).toBeGreaterThanOrEqual(3);
  for (const d of catalog.datasets) {
    expect(d.title_ar.length).toBeGreaterThan(0);
    expect(d.title_en.length).toBeGreaterThan(0);
    expect(["static", "monthly", "quarterly", "annual"]).toContain(d.cadence);
  }
});

test("every catalog entry has a loadable latest.json with columns", () => {
  for (const d of loadCatalog().datasets) {
    const latest = loadLatest(d.id);
    expect(latest.meta.id).toBe(d.id);
    expect(latest.meta.columns.length).toBeGreaterThan(0);
    expect(latest.data.length).toBe(d.rows);
    const names = latest.meta.columns.map((c) => c.name);
    expect(Object.keys(latest.data[0])).toEqual(names);
  }
});
