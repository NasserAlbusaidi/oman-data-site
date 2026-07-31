import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface CatalogEntry {
  id: string;
  title_ar: string;
  title_en: string;
  source_name: string;
  cadence: "static" | "monthly" | "annual";
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

export function loadCatalog(): Catalog {
  return JSON.parse(readFileSync(join(V1, "datasets.json"), "utf-8"));
}

export function loadLatest(id: string): Latest {
  return JSON.parse(readFileSync(join(V1, id, "latest.json"), "utf-8"));
}
