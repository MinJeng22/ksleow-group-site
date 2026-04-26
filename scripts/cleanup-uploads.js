#!/usr/bin/env node
/**
 * cleanup-uploads.js
 * ──────────────────
 * Scans every JSON file under src/content/ for /uploads/... references
 * and deletes any file under public/uploads/ that nothing points to.
 * Also removes empty subdirectories.
 *
 * Designed to run from the GitHub Action defined at
 * .github/workflows/cleanup-unused-uploads.yml
 *
 * Exit codes:
 *   0  — nothing to do, or cleanup completed
 *   1  — unexpected error
 *
 * Logs are intentionally verbose so the workflow run is auditable.
 */

import fs   from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content";
const UPLOADS_DIR = "public/uploads";

/* Match any string starting with /uploads/ until the next quote,
 * backslash, or whitespace. JSON doesn't escape forward slashes,
 * so the path appears verbatim. */
const URL_RE = /\/uploads\/[^"'\\\s]+/g;

function findReferences() {
  const refs = new Set();
  if (!fs.existsSync(CONTENT_DIR)) return refs;

  for (const name of fs.readdirSync(CONTENT_DIR)) {
    if (!name.endsWith(".json")) continue;
    const text = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8");
    for (const m of text.match(URL_RE) || []) refs.add(m);
  }
  return refs;
}

function listUploads() {
  const out = [];
  function walk(dir, urlPrefix) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      const url  = `${urlPrefix}/${e.name}`;
      if (e.isDirectory()) walk(full, url);
      else                 out.push({ full, url });
    }
  }
  walk(UPLOADS_DIR, "/uploads");
  return out;
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    removeEmptyDirs(sub);
    if (fs.readdirSync(sub).length === 0) {
      fs.rmdirSync(sub);
      console.log(`Removed empty dir ${sub}`);
    }
  }
}

const refs    = findReferences();
const all     = listUploads();
const orphans = all.filter(f => !refs.has(f.url));

console.log(`Referenced: ${refs.size}`);
console.log(`On disk:    ${all.length}`);
console.log(`Orphans:    ${orphans.length}`);

if (orphans.length === 0) {
  console.log("No cleanup needed.");
  process.exit(0);
}

for (const o of orphans) {
  fs.unlinkSync(o.full);
  console.log(`Deleted ${o.url}`);
}
removeEmptyDirs(UPLOADS_DIR);
console.log(`Done. Removed ${orphans.length} unused upload(s).`);
