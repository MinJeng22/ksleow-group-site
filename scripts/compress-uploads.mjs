/**
 * compress-uploads.mjs — post-build image compression
 * ══════════════════════════════════════════════════════════════
 * Walks dist/ (post-Vite-build output) and re-encodes every
 * JPG / PNG / WebP under `uploads/` with the smallest setting that
 * still looks visually identical to the original at the dimensions
 * the site renders.
 *
 *   • Per-folder rules (RULES below) — icons / logos / small UI
 *     assets keep very-high quality and are NEVER downscaled, so
 *     they stay pin-sharp at every screen DPR. Big lifestyle photos
 *     get a 2400 px cap and a slightly more aggressive (but still
 *     visually-lossless) re-encode.
 *   • Lossless PNG re-encode (no palette quantisation) — keeps
 *     transparency / fine artwork crisp.
 *   • EXIF orientation honored.
 *   • File only overwritten if the new buffer is smaller.
 *
 * Result: admins upload full-resolution originals via the CMS
 * (committed straight into public/uploads/) and visitors still
 * download a sensibly-sized asset because Vercel deploys dist/ —
 * not public/ — and dist/ has been through this pass.
 *
 * The public/uploads/ source files are never touched, so the CMS
 * can keep using them and re-running the build always re-derives
 * the optimized output.
 *
 * Skips silently if sharp isn't installed.
 * ══════════════════════════════════════════════════════════════ */
import fs   from "node:fs/promises";
import path from "node:path";

const ROOT = "dist/uploads";

/* Per-folder rules — first regex match wins.
 *
 *   maxWidth — cap the longest edge; smaller images are left alone.
 *   quality  — JPEG / WebP / PNG re-encode quality (higher = sharper).
 *
 * Icons / logos / branding marks stay sharp by skipping resize
 * entirely (they're already small artwork) and using very-high
 * re-encode quality. Lifestyle photos get a 2400 px cap + 88 quality
 * — at typical hero widths (1440 px) that's effectively lossless
 * but still cuts file size meaningfully. */
const RULES = [
  /* — KEEP SHARP — small UI artwork, logos, icons, branding — */
  { match: /\/icons\//,            maxWidth: Infinity, quality: { jpeg: 92, webp: 92, png: 95 } },
  { match: /\/branding\//,         maxWidth: Infinity, quality: { jpeg: 92, webp: 92, png: 95 } },
  { match: /\/services\//,         maxWidth: Infinity, quality: { jpeg: 90, webp: 90, png: 92 } },
  /* product LOGO marks (small flat artwork — distinct from
   * lifestyle showcase photos that share the products/ folder) */
  { match: /\/products\/(?:autocount-accounting\.|autocount-pos\.|autocount-02|hrms-logo|HRMS-logo|CLOUD-ACCOUNTING|ONESALES|feedme\.|Autocount-02|integration-icon|e-invoice-ready|autocountpos\.)\b/i,
                                    maxWidth: Infinity, quality: { jpeg: 92, webp: 92, png: 95 } },
  /* — RECOMPRESS — lifestyle photos / case-study hero shots / etc. */
  { match: /.*/,                    maxWidth: 2400,    quality: { jpeg: 88, webp: 88, png: 90 } },
];

function ruleFor(filepath) {
  const unix = filepath.replace(/\\/g, "/");
  return RULES.find(r => r.match.test(unix)) || RULES[RULES.length - 1];
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("[compress-uploads] sharp not installed — skipping. " +
    "Install with: npm i -D sharp");
  process.exit(0);
}

async function* walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalSaved = 0;
let touched    = 0;

/* When a big PNG/JPG sits in the catch-all (lifestyle photos), write
 * a .webp companion next to it — WebP cuts these 2–6 MB hero photos
 * down to 80–250 KB at visually-identical quality. Refs in JSON / JSX
 * should point at the .webp; the .png/.jpg is kept for download or
 * fallback. */
const WEBP_COMPANION_BYTES = 300 * 1024;  // 300 KB threshold

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const rule = ruleFor(file);

  try {
    const orig = await fs.stat(file);
    const img  = sharp(file, { failOn: "none" }).rotate();
    const meta = await img.metadata();

    const transformer = (meta.width && meta.width > rule.maxWidth)
      ? img.resize({ width: rule.maxWidth, withoutEnlargement: true })
      : img;

    const buf = ext === ".png"
      /* Lossless PNG: no palette quantisation so logos with
       * transparency and fine artwork stay pin-sharp. The quality
       * knob still tunes the deflate effort. */
      ? await transformer.png({ quality: rule.quality.png, compressionLevel: 9, palette: false }).toBuffer()
      : ext === ".webp"
      ? await transformer.webp({ quality: rule.quality.webp }).toBuffer()
      : await transformer.jpeg({ quality: rule.quality.jpeg, mozjpeg: true }).toBuffer();

    if (buf.length < orig.size) {
      await fs.writeFile(file, buf);
      const savedKB = (orig.size - buf.length) / 1024;
      totalSaved += orig.size - buf.length;
      touched += 1;
      console.log(`  ${file.replace(/\\/g, "/")}: ${(orig.size/1024).toFixed(0)} → ${(buf.length/1024).toFixed(0)} KB  (-${savedKB.toFixed(0)} KB)`);
    }

    /* Big-photo WebP companion — only for the catch-all bucket
     * (icons / logos already in their final form, don't dual-export). */
    const isCatchAll  = rule === RULES[RULES.length - 1];
    const isLargeRaster = (ext === ".png" || ext === ".jpg" || ext === ".jpeg") && orig.size > WEBP_COMPANION_BYTES;
    if (isCatchAll && isLargeRaster) {
      const webpPath = file.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      let needsCompanion = true;
      try {
        const existing = await fs.stat(webpPath);
        if (existing.mtimeMs >= orig.mtimeMs) needsCompanion = false; // up-to-date
      } catch { /* doesn't exist yet — needs companion */ }
      if (needsCompanion) {
        const wbuf = await transformer.webp({ quality: rule.quality.webp }).toBuffer();
        await fs.writeFile(webpPath, wbuf);
        console.log(`  ↳ ${webpPath.replace(/\\/g, "/")}: ${(wbuf.length/1024).toFixed(0)} KB (webp companion)`);
      }
    }
  } catch (err) {
    console.warn(`[compress-uploads] skip ${file}: ${err.message}`);
  }
}

if (touched === 0) {
  console.log("[compress-uploads] nothing to optimize");
} else {
  console.log(`[compress-uploads] ${touched} files optimized, ${(totalSaved/1024/1024).toFixed(2)} MB saved`);
}
