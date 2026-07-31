import { cpSync, existsSync, rmSync } from "node:fs";
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
console.log(`synced ${dest} from ${src}`);
