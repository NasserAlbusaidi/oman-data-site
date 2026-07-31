// Guards against the compressHTML whitespace trap: Astro's HTML compressor turns a
// newline next to an inline <a>/<code> into ZERO characters, so source that reads fine
// ("lives in the\n<a ...>oman-data</a>\nrepo") ships as "lives in the<a...</a>repo".
// See CLAUDE.md. Scans the built dist/ for a letter/digit touching an inline tag on
// either side. The one legitimate shape is an Arabic tatweel (U+0640) before an opening
// tag — the kashida connector in prefixes like "بـ" that take no space by design.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] ?? "dist";
const GLUED =
  /(?<opening>[\p{L}\p{N}])<(?:a|code)[ >]|<\/(?:a|code)>(?<closing>[\p{L}\p{N}])/gu;
const TATWEEL = "ـ";

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...htmlFiles(path));
    else if (entry.endsWith(".html")) out.push(path);
  }
  return out;
}

const offences = [];
const files = htmlFiles(DIST);
for (const file of files) {
  const lines = readFileSync(file, "utf-8").split("\n");
  lines.forEach((line, index) => {
    for (const match of line.matchAll(GLUED)) {
      // The tatweel exemption is about the opening-side shape only; a letter after a
      // closing tag is a defect no matter which letter it is.
      if (match.groups.opening === TATWEEL) continue;
      const context = line.slice(Math.max(0, match.index - 60), match.index + 60);
      offences.push(`${file}:${index + 1}: ...${context}...`);
    }
  });
}

if (offences.length > 0) {
  for (const offence of offences) console.error(offence);
  console.error(
    `::error::${offences.length} place(s) where text is glued to an inline tag — see the compressHTML trap in CLAUDE.md`,
  );
  process.exit(1);
}

console.log(`glue guard clean (${files.length} files)`);
