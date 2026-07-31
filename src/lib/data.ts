import { readFileSync } from "node:fs";

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

const V1 = new URL("../../public/v1/", import.meta.url);

export function loadCatalog(): Catalog {
  return JSON.parse(readFileSync(new URL("datasets.json", V1), "utf-8"));
}

export function loadLatest(id: string): Latest {
  return JSON.parse(readFileSync(new URL(`${id}/latest.json`, V1), "utf-8"));
}
