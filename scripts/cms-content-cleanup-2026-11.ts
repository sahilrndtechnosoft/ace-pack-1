// Applies the Nov 2026 website text cleanup to a database (e.g. the VPS), matching what was done locally:
//  - 26 Nov: "sample kit" / sample-request wording, the samples clauses in Terms & Privacy, "Factory" in the
//    home page inquiry heading;
//  - 27 Nov: the −20°C…+120°C thermal-range claims and "thermal"/"deep-freeze" wording; "Bento" → container wording.
// Covers page sections (content + subtitle), categories, products and events.
// Safe to run more than once: text that is already clean is left alone.
//
//   Preview (changes nothing):  node --env-file=.env --import tsx scripts/cms-content-cleanup-2026-11.ts
//   Apply:                      node --env-file=.env --import tsx scripts/cms-content-cleanup-2026-11.ts --apply
//
// --apply first writes every row it will change to data/backups/cms-cleanup-<timestamp>.json.
import fs from 'node:fs';
import path from 'node:path';
import { getDbPool } from '../lib/db';

type Json = unknown;

// Exact phrase → replacement, applied inside any text. Longer phrases first, so a shorter one never cuts into a longer one.
export const PHRASES: [string, string][] = [
  // 27 Nov — thermal range
  ['Every model below is moulded from 100% prime virgin PP 05 in an ISO 9001:2015 certified facility and rated from deep freeze to microwave.', 'Every model below is moulded from 100% prime virgin PP 05 in an ISO 9001:2015 certified facility.'],
  ['Engineered to withstand boiling soup filling up to 120°C and deep-freeze storage down to −20°C.', 'Engineered for hot soup filling and cold storage.'],
  ['Our stand will feature specialized temperature-resilient containers formulated to withstand desert logistics conditions, from −20°C deep freezing to microwave reheating up to +120°C without warping or chemical leaching.', 'Our stand will feature durable containers built to withstand desert logistics conditions without warping or chemical leaching.'],
  ['Thick impact-resistant walls provide superior thermal insulation for boiling hot curries or deep freeze storage.', 'Thick impact-resistant walls hold boiling hot curries securely.'],
  ['that withstands hot oil and boiling soup filling up to 120°C. Engineered from 100% virgin food-grade polypropylene (PP 05), completely microwave and deep-freeze safe.', 'that withstands hot oil and boiling soup filling. Engineered from 100% virgin food-grade polypropylene (PP 05), completely microwave safe.'],
  ['Yes, made of high heat-resistant virgin PP 05 withstanding temperatures up to 120°C without warping or softening.', 'Yes, made of high heat-resistant virgin PP 05 that resists warping or softening.'],
  [', certified food-safe with a thermal resistance rating of -20°C to +120°C.', ', certified food-safe.'],
  ['Yes, our PP 05 material has a operating thermal range spanning -20°C (deep freeze) up to +120°C (hot gravy filling and microwave reheating).', 'Yes. Our PP 05 containers are microwave safe for reheating and suitable for freezer storage.'],
  [' thermal shock verification (-20°C freezer to +120°C microwave),', ''],
  ['Freezer-grade containers resistant to low-temperature embrittlement down to −30°C.', 'Freezer-grade containers that resist low-temperature embrittlement.'],
  ['Built for demanding hot curry delivery, deep freezer storage, and automated packing lines.', 'Built for demanding hot curry delivery, cold storage, and automated packing lines.'],
  [', rated from deep freeze to microwave reheating.', '.'],
  ['microwave safe, scratch-proof, deep-freeze durable.', 'microwave safe and scratch-proof.'],
  ['microwave and deep-freeze durable', 'microwave-safe'],
  ['Hot broth spill-proof performance demonstrated up to 100°C soup transport', 'Hot broth spill-proof performance demonstrated for soup transport'],
  ['Microwave & freezer resistant (-20°C to +120°C)', 'Microwave & freezer safe'],
  ['heavyweight thick-wall containers providing superior thermal insulation', 'heavyweight thick-wall containers providing superior insulation'],
  ['Heavyweight thick-wall containers providing superior thermal insulation', 'Heavyweight thick-wall containers providing superior insulation'],
  ['Deep-freeze resistant down to −20°C: crack-proof walls preventing freezer burn and brittleness.', 'Crack-proof walls that prevent freezer burn and brittleness in frozen storage.'],
  ['Microwave safe up to 120°C', 'Microwave safe'],
  ['Freezer resistant to -20°C', 'Freezer safe'],
  // 27 Nov — "Bento" → container wording
  ['Cloud Kitchens, Biryanis, Rice Combos & Bento Meals', 'Cloud Kitchens, Biryanis, Rice Combos & Meal Combos'],
  ['Rectangular takeaway and bento multi-compartment containers', 'Rectangular takeaway and multi-compartment containers'],
  ['Rectangular Food & Bento Meal Boxes', 'Rectangular Food & Meal Boxes'],
  ['AP-RE-232 (2-Compartment Bento)', 'AP-RE-232 (2-Compartment Container)'],
  ['hinge cups, bento boxes, gravy tubs', 'hinge cups, meal containers, gravy tubs'],
  ['RE-Series Bento Boxes', 'RE-Series Containers'],
  ['RE Series Bento Compartments', 'RE Series Compartment Containers'],
  ['RE Bento Meal Delivery Boxes', 'RE Meal Delivery Containers'],
  ['Series 01 · Bento Architecture', 'Series 01 · Multi-Compartment Design'],
  ['multi-compartment bento boxes', 'multi-compartment meal boxes'],
  ['500,000 bento boxes', '500,000 meal containers'],
  ['multi-cavity bento trays', 'multi-cavity meal trays'],
  ['for executive bento and', 'for executive meal boxes and'],
  ['gourmet bento,', 'gourmet meal boxes,'],
  ['Bento & Meal Delivery', 'Meal Delivery Containers'],
  ['Bento & Meal Prep', 'Meal Prep Containers'],
  // 26 Nov — sample wording
  ['Test our zero-leak snap seals and extreme thermal durability in your own kitchen or packaging line. We dispatch curated sample kits across India and global ports within 24 hours.', 'Tell us about your containers, volumes and delivery locations, and our team will get back to you within 24 hours.'],
  ['We welcome corporate procurement heads, brand managers, and export buyers for scheduled on-site audits at our Daman manufacturing campus. Request free physical sample kits or review our official ISO 9001:2015 audit file.', 'We welcome corporate procurement heads, brand managers, and export buyers for scheduled on-site audits at our Daman manufacturing campus. Contact us to schedule a visit or review our official ISO 9001:2015 audit file.'],
  ['These terms govern all quotations, sample dispatches, bulk production orders,', 'These terms govern all quotations, bulk production orders,'],
  ['Tell us about your application and request product specifications or a custom sample kit.', 'Tell us about your application and request product specifications.'],
  ['Tell us about your application and request product information or a sample kit.', 'Tell us about your application and request product information.'],
  ['We ship physical samples and full technical spec sheets for every model in the range.', 'Full technical specifications are available for every model in the range. Talk to our team about custom branding.'],
  ['Visit our expo booths to test physical container samples, discuss volume contracts, and review mould innovations.', 'Visit our expo booths to see our containers up close, discuss volume contracts, and review mould innovations.'],
  ['Request physical sample kits or speak directly with our factory tooling specialists.', 'Speak directly with our tooling specialists.'],
  ['Request physical sample kits, discuss bespoke mould tooling, or get', 'Discuss bespoke mould tooling, or get'],
  ['Over 1,200 physical sample kits delivered to restaurant chains and QSRs', 'Container range showcased to restaurant chains and QSRs'],
  ['Fulfilling sample kit shipments and providing factory freight estimates.', 'Providing freight estimates for orders.'],
  ['Product Specifications & Sample Kits', 'Product Specifications & Pricing Support'],
  ['Product catalog & sample kit', 'Product catalog'],
  ['Catalog & Sample Kit', 'Product Catalog'],
  ['Samples & Specifications', 'Custom Branding & Specifications'],
  ['Complimentary Factory Samples', 'Talk to Our Team'],
  ['Request Free Sample Kit', 'Contact Us'],
  ['Request Samples', 'Contact Sales'],
];
// Whole-value replacements (short labels that would be risky to match inside longer text).
const EXACT: Record<string, string> = {
  'RE Series Bento': 'RE Series Container',
  '2-Comp Bento': '2-Comp Container',
  '2-Compartment Bento': '2-Compartment Meals',
  'Deep-freeze lid': 'Freezer-safe lid',
  '−20 · +120°C': 'ISO 9001',
  'Rated Range': 'Certified Plant',
};
// Chips, bullets and spec lines that only state the temperature range: removed from their lists. A list item that is an
// object (e.g. a "fact" or inspection step) is removed when any of its own text fields is one of these.
const DROP = new Set([
  '−20°C to +120°C Safe',
  'Deep Freeze -20°C',
  'Rated −20°C deep freeze to +120°C microwave reheating',
  '03 / Extreme thermal range',
  '−20°C rated',
  'Thermal cycling tested from −20°C to +120°C',
  'Thermal Endurance Rating',
  'Deep freeze (−20°C) to microwave (+120°C) endurance verified containers',
  'Thermal Resistance:',
  '-20°C (Deep Freeze) to +120°C (Microwave)',
]);
const isDropped = (v: Json) =>
  (typeof v === 'string' && DROP.has(v)) ||
  (!!v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).some((x) => typeof x === 'string' && DROP.has(x)));

// After an item is dropped from a numbered list ("01", "02", …), close the gap in its step/num field.
const renumber = (items: Json[]) =>
  items.map((item, i) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
    const field = ['step', 'num', 'number'].find((f) => /^\d{2}$/.test(String((item as any)[f] ?? '')));
    return field ? { ...item, [field]: String(i + 1).padStart(2, '0') } : item;
  });

// Only the home page inquiry heading drops "Factory" (the Contact page heading was left as is).
const HOME_FORM_HEADING: [string, string] = ['Send Factory Inquiry', 'Send Inquiry'];
const PRIVACY_BULLET_TO_REMOVE = 'Request physical sample kits for cloud kitchens, QSRs, or food brands.';
const TERMS_CLAUSE_TO_REMOVE = /^\d+\.\s*Sample Evaluations/;

const replacePhrases = (text: string) => PHRASES.reduce((t, [from, to]) => t.split(from).join(to), text);

function cleanValue(value: Json): Json {
  if (typeof value === 'string') return DROP.has(value) ? '' : EXACT[value] ?? replacePhrases(value);
  if (Array.isArray(value)) {
    const kept = value.filter((v) => !isDropped(v)).map(cleanValue);
    return kept.length === value.length ? kept : renumber(kept);
  }
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanValue(v)]));
  return value;
}

/** Cleaned section content (as stored JSON text), with the Terms/Privacy structural edits. */
export function cleanSectionJson(pageSlug: string, sectionKey: string, json: string): string {
  let content: any;
  try {
    content = JSON.parse(json);
  } catch {
    return cleanText(json); // not JSON
  }
  if (pageSlug === 'privacy' && sectionKey === 'document' && Array.isArray(content?.clauses)) {
    content.clauses = content.clauses.map((clause: any) =>
      Array.isArray(clause.bullets) ? { ...clause, bullets: clause.bullets.filter((b: string) => b !== PRIVACY_BULLET_TO_REMOVE) } : clause
    );
  }
  if (pageSlug === 'terms' && sectionKey === 'document' && Array.isArray(content?.clauses)) {
    const kept = content.clauses.filter((clause: any) => !TERMS_CLAUSE_TO_REMOVE.test(String(clause.title ?? '')));
    if (kept.length !== content.clauses.length) {
      content.clauses = kept.map((clause: any, i: number) => ({ ...clause, title: String(clause.title ?? '').replace(/^\d+\./, `${i + 1}.`) }));
    }
  }
  if (pageSlug === 'home' && sectionKey === 'faq' && content?.formHeading === HOME_FORM_HEADING[0]) content.formHeading = HOME_FORM_HEADING[1];
  const cleaned = JSON.stringify(cleanValue(content));
  // Keep the stored text byte-identical when nothing changed (no reformatting churn).
  return cleaned === JSON.stringify(JSON.parse(json)) ? json : cleaned;
}

/** Plain text or JSON text (lists, objects) from a regular column, cleaned the same way as section content. */
export function cleanText(text: string): string {
  if (/^\s*[[{]/.test(text)) {
    try {
      const parsed = JSON.parse(text);
      const cleaned = JSON.stringify(cleanValue(parsed));
      return cleaned === JSON.stringify(parsed) ? text : cleaned;
    } catch {
      // not JSON after all: fall through to plain text
    }
  }
  return EXACT[text] ?? replacePhrases(text);
}

// Regular tables whose text columns are cleaned (all CHAR/TEXT columns, so new columns are covered too).
const TABLES = [
  { table: 'events', key: 'id' },
  { table: 'categories', key: 'id' },
  { table: 'products', key: 'id' },
];

async function main() {
  const apply = process.argv.includes('--apply');
  const db = getDbPool();

  const [sectionRows]: any = await db.query('SELECT * FROM sections');
  const sectionChanges = [];
  for (const row of sectionRows) {
    const published = cleanSectionJson(row.page_slug, row.section_key, row.published_content ?? '');
    const draft = cleanSectionJson(row.page_slug, row.section_key, row.draft_content ?? '');
    const subtitle = typeof row.subtitle === 'string' ? cleanText(row.subtitle) : row.subtitle;
    if (published !== (row.published_content ?? '') || draft !== (row.draft_content ?? '') || subtitle !== row.subtitle) {
      sectionChanges.push({ row, published, draft, subtitle });
    }
  }

  const rowChanges: { table: string; key: string; row: any; fields: Record<string, string> }[] = [];
  for (const { table, key } of TABLES) {
    const [columns]: any = await db.query(`SHOW COLUMNS FROM \`${table}\``);
    const textColumns: string[] = columns.filter((c: any) => /char|text|json/i.test(c.Type) && c.Field !== key).map((c: any) => c.Field);
    const [rows]: any = await db.query(`SELECT * FROM \`${table}\``);
    for (const row of rows) {
      const fields: Record<string, string> = {};
      for (const col of textColumns) {
        if (typeof row[col] === 'string' && cleanText(row[col]) !== row[col]) fields[col] = cleanText(row[col]);
      }
      if (Object.keys(fields).length) rowChanges.push({ table, key, row, fields });
    }
  }

  sectionChanges.forEach(({ row }) => console.log(`section  ${row.page_slug}/${row.section_key}`));
  rowChanges.forEach(({ table, key, row, fields }) => console.log(`${table.padEnd(10)} ${row[key]} (${Object.keys(fields).join(', ')})`));
  const total = sectionChanges.length + rowChanges.length;
  console.log(`${sectionChanges.length} section(s) and ${rowChanges.length} other row(s) need changes.`);

  if (!apply || total === 0) {
    if (!apply && total > 0) console.log('Preview only. Run again with --apply to write these changes.');
    process.exit(0);
  }

  const backupDir = path.join(process.cwd(), 'data/backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `cms-cleanup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupFile, JSON.stringify({ sections: sectionChanges.map((c) => c.row), rows: rowChanges.map((c) => ({ table: c.table, row: c.row })) }, null, 2));
  console.log(`Backup written: ${path.relative(process.cwd(), backupFile)}`);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (const { row, published, draft, subtitle } of sectionChanges) {
      await conn.query('UPDATE sections SET published_content = ?, draft_content = ?, subtitle = ?, updated_at = NOW() WHERE id = ?', [published, draft, subtitle, row.id]);
    }
    for (const { table, key, row, fields } of rowChanges) {
      const cols = Object.keys(fields);
      await conn.query(`UPDATE \`${table}\` SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE \`${key}\` = ?`, [...cols.map((c) => fields[c]), row[key]]);
    }
    await conn.commit();
    console.log('Done. Restart the website (pm2 restart acepack-website) so cached pages pick up the new text.');
  } catch (err) {
    await conn.rollback();
    console.error('Nothing was changed (rolled back):', err);
    process.exitCode = 1;
  } finally {
    conn.release();
  }
  process.exit();
}

if (process.argv[1]?.endsWith('cms-content-cleanup-2026-11.ts')) main();
