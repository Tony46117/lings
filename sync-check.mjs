import fs from "node:fs";

const text = fs.readFileSync("worker.js", "utf8");
const marker = "const ASSETS_JSON = ";
const start = text.indexOf(marker) + marker.length;
const end = text.lastIndexOf(";");
const assets = JSON.parse(text.slice(start, end));

let ok = true;
for (const name of ["index.html", "styles.css", "script.js"]) {
  const sync = assets[name] === fs.readFileSync(name, "utf8");
  console.log(`${name}: ${sync ? "SYNC" : "MISMATCH"}`);
  if (!sync) ok = false;
}
console.log(`bundle size: ${text.length} bytes`);
if (!ok) process.exit(1);
