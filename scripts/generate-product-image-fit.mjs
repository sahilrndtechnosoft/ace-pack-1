// Measures where the container sits in each product photo and stores the largest zoom that
// keeps it fully in frame, so small cups get enlarged and wide boxes are never cut off.
// Output: lib/data/product-image-fit.json  →  { "/images/products/…": { s, ox, oy } }
// Pages apply it as object-position and transform-origin (ox% oy%) plus transform: scale(s).
// Run after adding product photos:  node scripts/generate-product-image-fit.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, 'public/images/products');
const OUT_FILE = path.join(ROOT, 'lib/data/product-image-fit.json');
const SAMPLE_WIDTH = 240;
const EDGE_SAMPLE = 6; // columns at each side used to read the backdrop colour of a row
const BG_DISTANCE = 34; // colour distance that counts as "not backdrop"
const MIN_HITS = 2; // pixels needed in a row/column for it to count as product
// Box shapes (width / height) the photos are shown in: 4:3 cards, detail viewer and menu preview; 16:11 carousel.
const VIEW_ASPECTS = [4 / 3, 16 / 11];
const MARGIN = 0.06; // breathing room kept around the product, as a fraction of the box
const MAX_ZOOM = 2.2;

const round = (n, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listImages(full);
    return /\.(webp|png|jpe?g)$/i.test(entry.name) ? [full] : [];
  });
}

async function productBox(file) {
  const { data, info } = await sharp(file).resize({ width: SAMPLE_WIDTH }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const rowHits = new Array(h).fill(0);
  const colHits = new Array(w).fill(0);
  for (let y = 0; y < h; y++) {
    const bg = [0, 0, 0];
    let n = 0;
    for (const x of [...Array(EDGE_SAMPLE).keys(), ...Array.from({ length: EDGE_SAMPLE }, (_, i) => w - 1 - i)]) {
      const i = (y * w + x) * c;
      bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; n++;
    }
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * c;
      const isTransparent = data[i + 3] < 20;
      const d = Math.hypot(data[i] - bg[0] / n, data[i + 1] - bg[1] / n, data[i + 2] - bg[2] / n);
      if (!isTransparent && d > BG_DISTANCE) { rowHits[y]++; colHits[x]++; }
    }
  }
  const first = (arr) => arr.findIndex((v) => v >= MIN_HITS);
  const last = (arr) => arr.length - 1 - [...arr].reverse().findIndex((v) => v >= MIN_HITS);
  const x0 = first(colHits), x1 = last(colHits), y0 = first(rowHits), y1 = last(rowHits);
  if (x0 < 0 || y0 < 0) return null;
  return { x0: x0 / w, x1: (x1 + 1) / w, y0: y0 / h, y1: (y1 + 1) / h, aspect: w / h };
}

// Largest zoom around (ox, oy) keeping [p0, p1] inside [MARGIN, 1 - MARGIN] of the visible box.
function axisLimit(p0, p1, o) {
  let s = MAX_ZOOM;
  if (p0 < o) s = Math.min(s, (o - MARGIN) / (o - p0));
  if (p1 > o) s = Math.min(s, (1 - MARGIN - o) / (p1 - o));
  return s;
}

function fitFor(box) {
  const ox = (box.x0 + box.x1) / 2;
  const oy = (box.y0 + box.y1) / 2;
  let s = MAX_ZOOM;
  for (const view of VIEW_ASPECTS) {
    // The page uses object-position (ox%, oy%) with object-fit: cover, which puts the product
    // centre at (ox%, oy%) of the box in every box shape; the visible part of the photo
    // (visW × visH) is what gets stretched to fill the box.
    const visW = view > box.aspect ? 1 : view / box.aspect;
    const visH = view > box.aspect ? box.aspect / view : 1;
    const toX = (x) => ox + (x - ox) / visW;
    const toY = (y) => oy + (y - oy) / visH;
    // transform-origin is the same (ox%, oy%), so zooming keeps the product centre in place.
    s = Math.min(s, axisLimit(toX(box.x0), toX(box.x1), ox), axisLimit(toY(box.y0), toY(box.y1), oy));
  }
  return { s: round(Math.max(1, s), 2), ox: round(ox * 100, 1), oy: round(oy * 100, 1) };
}

const result = {};
for (const file of listImages(IMAGE_DIR).sort()) {
  const box = await productBox(file);
  if (!box) continue;
  result['/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/')] = fitFor(box);
}
fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 1) + '\n');
console.log(`Wrote ${Object.keys(result).length} entries to ${path.relative(ROOT, OUT_FILE)}`);
