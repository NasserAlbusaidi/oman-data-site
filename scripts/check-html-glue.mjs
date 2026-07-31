// Guards against the compressHTML whitespace trap: Astro's HTML compressor turns a
// newline between text and an inline <a>/<code> into ZERO characters, so source that
// reads fine ("lives in the\n<a ...>oman-data</a> repo") ships as "lives in the<a...".
// See CLAUDE.md. Scans the built dist/ for a letter/digit immediately followed by an
// inline tag, which is always a defect except after an Arabic tatweel (U+0640), the
// kashida connector used for prefixes like "بـ" that legitimately take no space.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] ?? "dist";
const GLUED = /[\p{L}\p{N}](<(?:a|code)[ >])/gu;
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
for (const file of htmlFiles(DIST)) {
  const lines = readFileSync(file, "utf-8").split("\n");
  lines.forEach((line, index) => {
    for (const match of line.matchAll(GLUED)) {
      if (line[match.index] === TATWEEL) continue;
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

console.log("glue guard clean");
