import { readFileSync, writeFileSync } from "node:fs";

// $css-version format: MM.DD.YY.N, where N counts edits made that day.
const file = "src/zerosum.scss";
const src = readFileSync(file, "utf8");
const pattern = /^\$css-version:\s*"([^"]*)";/m;
const match = src.match(pattern);
if (!match) {
  console.error(`${file}: missing $css-version declaration`);
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const today = `${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getFullYear() % 100)}`;

const [, current] = match;
const parts = current.split(".");
const sameDay = parts.slice(0, 3).join(".") === today;
const next = `${today}.${sameDay ? Number(parts[3] || 0) + 1 : 1}`;

writeFileSync(file, src.replace(pattern, `$css-version: "${next}";`));
console.log(`$css-version: ${current} -> ${next}`);
