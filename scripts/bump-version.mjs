import { readFileSync, writeFileSync } from "node:fs";

// $css-version format: MM.DD.YY.N, where N counts edits made that day.
// --letter adds or advances a letter instead (10.06.26.5 -> 10.06.26.5a -> 10.06.26.5b);
// CI uses it for edits pushed without a bump.
const file = "rules.scss";
const src = readFileSync(file, "utf8");
const pattern = /^\$css-version:\s*"([^"]*)";/m;
const match = src.match(pattern);
if (!match) {
  console.error(`${file}: missing $css-version declaration`);
  process.exit(1);
}

const [, current] = match;
let next;

if (process.argv.includes("--letter")) {
  const [, base, letters = ""] = current.match(/^(.*?\d)([a-z]*)$/) || [, current, ""];
  if (!letters) {
    next = `${base}a`;
  } else {
    const last = letters.at(-1);
    next = base + (last === "z" ? `${letters}a` : letters.slice(0, -1) + String.fromCharCode(last.charCodeAt(0) + 1));
  }
} else {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const today = `${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getFullYear() % 100)}`;
  const parts = current.split(".");
  const sameDay = parts.slice(0, 3).join(".") === today;
  next = `${today}.${sameDay ? (parseInt(parts[3], 10) || 0) + 1 : 1}`;
}

writeFileSync(file, src.replace(pattern, `$css-version: "${next}";`));
console.log(`$css-version: ${current} -> ${next}`);
