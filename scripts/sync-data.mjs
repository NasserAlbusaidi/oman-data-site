import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const REPO = "https://github.com/NasserAlbusaidi/oman-data";
const local = resolve(process.env.OMAN_DATA_DIR ?? "../oman-data");

let src = resolve(local, "api", "v1");
if (!existsSync(resolve(src, "datasets.json"))) {
  const clone = resolve(".oman-data-clone");
  rmSync(clone, { recursive: true, force: true });
  execSync(`git clone --depth 1 ${REPO} "${clone}"`, { stdio: "inherit" });
  src = resolve(clone, "api", "v1");
}

const dest = resolve("public", "v1");
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

// A partial or stale source tree is the failure mode that otherwise surfaces as a
// confusing build/test error much later — so assert completeness here, at the source.
const catalogPath = resolve(dest, "datasets.json");
if (!existsSync(catalogPath)) {
  console.error(`sync failed: no datasets.json under ${dest} (source was ${src})`);
  process.exit(1);
}
const catalog = JSON.parse(readFileSync(catalogPath, "utf-8"));
const missing = catalog.datasets
  .map((d) => d.id)
  .filter((id) => !existsSync(resolve(dest, id, "latest.json")));
if (missing.length > 0) {
  console.error(
    `sync failed: ${missing.length} catalog dataset(s) have no latest.json under ${dest}: ${missing.join(", ")}`,
  );
  console.error(`source was ${src} — re-run after updating/pushing the oman-data repo`);
  process.exit(1);
}

console.log(`synced ${dest} from ${src} (${catalog.datasets.length} datasets verified)`);
