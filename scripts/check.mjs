import { readFileSync } from "node:fs";

const file = "src/zerosum.scss";
const lines = readFileSync(file, "utf8").split("\n");

// Magic CSS bundles an old Sass that rejects space-separated color syntax,
// e.g. rgb(0 0 0 / 0.1). It needs the comma form: rgba(0, 0, 0, 0.1).
const modernColor = /\b(rgba?|hsla?)\(\s*[^,()]*?\d[^,()]*\s+[\d.]+%?\s+[\d.]+%?(\s*\/[^)]*)?\)/;

const errors = [];
lines.forEach((line, i) => {
  const code = line.replace(/\/\/.*$/, "");
  if (modernColor.test(code)) {
    errors.push(`${file}:${i + 1}: use comma-separated color syntax for Magic CSS\n    ${line.trim()}`);
  }
});

if (!/^\$css-version:\s*"[^"]+";/m.test(lines.join("\n"))) {
  errors.push(`${file}: missing $css-version declaration`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${file}: OK`);
