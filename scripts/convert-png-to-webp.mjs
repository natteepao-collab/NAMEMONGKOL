import { glob } from "glob";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const QUALITY = 82;
const TARGET_DIR = "public/images/articles";
const pattern = `${TARGET_DIR}/**/*.png`;

const files = await glob(pattern, { nodir: true });

if (!files.length) {
  console.log("No PNG files found.");
  process.exit(0);
}

console.log(`Found ${files.length} PNG files to convert.\n`);

let ok = 0;
let fail = 0;
let skipped = 0;

for (const file of files) {
  const out = file.replace(/\.png$/i, ".webp");

  // Skip if .webp already exists
  if (fs.existsSync(out)) {
    console.log(`SKIP (exists): ${out}`);
    skipped++;
    continue;
  }

  try {
    const info = await sharp(file).webp({ quality: QUALITY }).toFile(out);
    const pngSize = fs.statSync(file).size;
    const saved = (((pngSize - info.size) / pngSize) * 100).toFixed(1);
    console.log(`OK: ${path.basename(file)} → .webp  (${saved}% smaller)`);
    ok++;
  } catch (err) {
    console.error(`FAIL: ${file}`, err.message);
    fail++;
  }
}

console.log(`\nDone. Success: ${ok}, Skipped: ${skipped}, Failed: ${fail}`);
