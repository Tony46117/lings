/**
 * build-worker.mjs — bundles the site (index.html, styles.css, script.js)
 * plus binary assets (video, images) into worker.js as ASSETS_JSON so the
 * site can be deployed as a single-file Cloudflare Worker (paste the
 * resulting worker.js into the dashboard).
 *
 * Usage:  node build-worker.mjs
 *
 * This script replaces EVERYTHING from the `const ASSETS_JSON = ` marker
 * to the end of file, so re-running it always produces a fresh bundle
 * (idempotent) — even if worker.js already contains a previous bundle.
 *
 * Binary assets are stored base64-encoded with a "b64:" prefix so the
 * worker's fetch handler can decode them and serve with the right
 * Content-Type.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(dir, "assets");

// text files are inlined as-is; binary files are base64-encoded
const TEXT_FILES = ["index.html", "styles.css", "script.js"];
const BINARY_FILES = [
  "avocado-timelapse.mp4",
  "poster.jpg",
  "apple.webp",
  "avocado.webp",
  "passion.webp",
];

const files = {};
for (const name of TEXT_FILES) {
  files[name] = readFileSync(path.join(dir, name), "utf8");
}
for (const name of BINARY_FILES) {
  files[name] = "b64:" + readFileSync(path.join(assetsDir, name)).toString("base64");
}

const workerSrc = readFileSync(path.join(dir, "worker.js"), "utf8");

const marker = "const ASSETS_JSON = ";
const markerIdx = workerSrc.indexOf(marker);
if (markerIdx === -1) {
  console.error("build-worker.mjs: marker 'const ASSETS_JSON = ' not found in worker.js — aborting.");
  process.exit(1);
}

// Keep everything before the marker (worker logic + comments), drop any
// previous bundle, and append the freshly inlined assets.
const head = workerSrc.slice(0, markerIdx);
const json = JSON.stringify(files, null, 2);
const patched = head + marker + json + ";\n";

writeFileSync(path.join(dir, "worker.js"), patched);
const sizes = Object.entries(files).map(([k, v]) => `${k} (${Math.round(v.length / 1024)}KB)`).join(", ");
console.log("worker.js bundled:", sizes);
