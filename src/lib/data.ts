import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface CatalogEntry {
  id: string;
  title_ar: string;
  title_en: string;
  source_name: string;
  cadence: "static" | "monthly" | "quarterly" | "annual";
  as_of: string;
  fetched_at: string;
  stale: boolean;
  rows: number;
}

export interface Catalog {
  generated_at: string;
  datasets: CatalogEntry[];
}

export interface ColumnMeta {
  name: string;
  dtype: "int" | "float" | "str";
  min: number | null;
  max: number | null;
}

export interface LatestMeta extends CatalogEntry {
  source_url: string;
  license: string;
  columns: ColumnMeta[];
  notes: string;
}

export interface Latest {
  meta: LatestMeta;
  data: Record<string, string | number>[];
}

// Anchored to the project root, not to import.meta.url: Astro bundles this module
// into dist/.prerender/chunks/ for the prerender pass, so a URL-relative path
// resolves to dist/public/v1 and the build dies with ENOENT. cwd is the project
// root for both `astro build` and vitest.
const V1 = join(process.cwd(), "public", "v1");

const CADENCES = ["static", "monthly", "quarterly", "annual"] as const;

/**
 * The published JSON is a build input from another repo, so it is a boundary,
 * not internal code. A wrong cadence silently renders `undefined` as the
 * cadence label, and a non-boolean `stale` makes the freshness badge lie —
 * both would ship green through Cloudflare Pages, which reports only the exit
 * code. Failing the build with the offending id is the loud alternative.
 */
function assertEntry(entry: CatalogEntry, where: string): void {
  const id = entry?.id ?? "<missing id>";
  if (!CADENCES.includes(entry?.cadence)) {
    throw new Error(
      `${where}: dataset "${id}" has cadence ${JSON.stringify(entry?.cadence)}, expected one of ${CADENCES.join(", ")}`,
    );
  }
  if (typeof entry?.stale !== "boolean") {
    throw new Error(
      `${where}: dataset "${id}" has stale ${JSON.stringify(entry?.stale)}, expected a boolean`,
    );
  }
}

export function loadCatalog(): Catalog {
  const catalog: Catalog = JSON.parse(
    readFileSync(join(V1, "datasets.json"), "utf-8"),
  );
  for (const entry of catalog.datasets) assertEntry(entry, "datasets.json");
  return catalog;
}

export function loadLatest(id: string): Latest {
  const latest: Latest = JSON.parse(
    readFileSync(join(V1, id, "latest.json"), "utf-8"),
  );
  const where = `${id}/latest.json`;
  assertEntry(latest.meta, where);
  if (!Array.isArray(latest.meta?.columns) || latest.meta.columns.length === 0) {
    throw new Error(
      `${where}: dataset "${id}" has no columns — the schema table and the row table would render empty`,
    );
  }
  return latest;
}
