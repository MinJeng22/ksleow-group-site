import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageRoots = [
  path.join(root, "public", "images"),
  path.join(root, "src", "assets", "images"),
];
const rewriteRoots = [
  path.join(root, "src"),
  path.join(root, "public", "admin"),
  path.join(root, "index.html"),
];
const originalRoot = path.join(root, "original-images");
const imageExtPattern = /\.(png|jpe?g)$/i;
const textExts = new Set([
  ".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml",
]);

async function exists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function* walk(filepath) {
  const stat = await fs.stat(filepath);
  if (stat.isFile()) {
    yield filepath;
    return;
  }

  const entries = await fs.readdir(filepath, { withFileTypes: true });
  for (const entry of entries) {
    const child = path.join(filepath, entry.name);
    if (entry.isDirectory()) yield* walk(child);
    else yield child;
  }
}

function toPosix(filepath) {
  return filepath.split(path.sep).join("/");
}

function webpPathFor(filepath) {
  return filepath.replace(imageExtPattern, ".webp");
}

function archivePathFor(filepath) {
  const rel = path.relative(root, filepath);
  return path.join(originalRoot, rel);
}

function replacementPairsFor(filepath) {
  const rel = toPosix(path.relative(root, filepath));
  const webpRel = rel.replace(imageExtPattern, ".webp");
  const pairs = [[rel, webpRel]];

  if (rel.startsWith("public/")) {
    const publicPath = rel.slice("public".length);
    const publicWebp = webpRel.slice("public".length);
    pairs.push([publicPath, publicWebp]);
  }

  return pairs;
}

async function convertImage(filepath) {
  const webpPath = webpPathFor(filepath);
  const metadata = await sharp(filepath, { failOn: "none" }).metadata();
  const isFlatArtwork = /[\\/](icons|logos|branding|brands|awards)[\\/]/i.test(filepath);
  const quality = isFlatArtwork ? 92 : 86;
  let pipeline = sharp(filepath, { failOn: "none" }).rotate();

  if (!isFlatArtwork && metadata.width && metadata.width > 2400) {
    pipeline = pipeline.resize({ width: 2400, withoutEnlargement: true });
  }

  await pipeline.webp({ quality, effort: 5 }).toFile(webpPath);
  return webpPath;
}

async function rewriteReferences(pairs) {
  let changedFiles = 0;
  for (const rewriteRoot of rewriteRoots) {
    if (!(await exists(rewriteRoot))) continue;
    for await (const filepath of walk(rewriteRoot)) {
      if (!textExts.has(path.extname(filepath).toLowerCase())) continue;
      let content = await fs.readFile(filepath, "utf8");
      let next = content;
      for (const [from, to] of pairs) {
        next = next.split(from).join(to);
      }
      if (next !== content) {
        await fs.writeFile(filepath, next);
        changedFiles += 1;
      }
    }
  }
  return changedFiles;
}

async function archiveOriginal(filepath) {
  const target = archivePathFor(filepath);
  await fs.mkdir(path.dirname(target), { recursive: true });

  if (await exists(target)) {
    await fs.rm(filepath);
  } else {
    await fs.rename(filepath, target);
  }
}

const images = [];
for (const imageRoot of imageRoots) {
  if (!(await exists(imageRoot))) continue;
  for await (const filepath of walk(imageRoot)) {
    if (imageExtPattern.test(filepath)) images.push(filepath);
  }
}

const replacementPairs = [];
const convertedImages = [];
let converted = 0;
let skipped = 0;

for (const image of images) {
  try {
    await convertImage(image);
    convertedImages.push(image);
    replacementPairs.push(...replacementPairsFor(image));
    converted += 1;
  } catch (error) {
    skipped += 1;
    console.warn(`[convert-images-to-webp] Skipped ${path.relative(root, image).replace(/\\/g, "/")}: ${error.message}`);
  }
}

const rewritten = await rewriteReferences(replacementPairs);

for (const image of convertedImages) {
  await archiveOriginal(image);
}

console.log(`[convert-images-to-webp] Converted ${converted} images to WebP.`);
if (skipped) console.log(`[convert-images-to-webp] Skipped ${skipped} unsupported images.`);
console.log(`[convert-images-to-webp] Rewrote references in ${rewritten} files.`);
console.log(`[convert-images-to-webp] Archived originals under ${path.relative(root, originalRoot).replace(/\\/g, "/")}/.`);
