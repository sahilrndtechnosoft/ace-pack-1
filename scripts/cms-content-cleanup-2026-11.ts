// Applies the Nov 2026 website text cleanup to a database (e.g. the VPS), matching what was done locally:
// "sample kit" / sample-request wording, the samples clauses in Terms & Privacy, and "Factory" in the
// home page inquiry heading. Safe to run more than once: text that is already clean is left alone.
//
//   Preview (changes nothing):  node --env-file=.env --import tsx scripts/cms-content-cleanup-2026-11.ts
//   Apply:                      node --env-file=.env --import tsx scripts/cms-content-cleanup-2026-11.ts --apply
//
// --apply first writes every row it will change to data/backups/cms-cleanup-<timestamp>.json.
import fs from 'node:fs';
import path from 'node:path';
import { getDbPool } from '../lib/db';

type Json = unknown;

// Exact phrase → replacement. Longer phrases first, so a shorter one never cuts into a longer one.
export const PHRASES: [string, string][] = [
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
// Only the home page inquiry heading drops "Factory" (the Contact page heading was left as is).
const HOME_FORM_HEADING: [string, string] = ['Send Factory Inquiry', 'Send Inquiry'];
const PRIVACY_BULLET_TO_REMOVE = 'Request physical sample kits for cloud kitchens, QSRs, or food brands.';
const TERMS_CLAUSE_TO_REMOVE = /^\d+\.\s*Sample Evaluations/;

const replacePhrases = (text: string) => PHRASES.reduce((t, [from, to]) => t.split(from).join(to), text);

function cleanValue(value: Json): Json {
  if (typeof value === 'string') return replacePhrases(value);
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanValue(v)]));
  return value;
}

/** Cleaned section content (as stored JSON text), with the Terms/Privacy structural edits. */
export function cleanSectionJson(pageSlug: string, sectionKey: string, json: string): string {
  let content: any;
  try {
    content = JSON.parse(json);
  } catch {
    return replacePhrases(json); // not JSON: plain text replacement only
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

async function main() {
  const apply = process.argv.includes('--apply');
  const db = getDbPool();

  const [sectionRows]: any = await db.query('SELECT * FROM sections');
  const sectionChanges = [];
  for (const row of sectionRows) {
    const published = cleanSectionJson(row.page_slug, row.section_key, row.published_content ?? '');
    const draft = cleanSectionJson(row.page_slug, row.section_key, row.draft_content ?? '');
    if (published !== (row.published_content ?? '') || draft !== (row.draft_content ?? '')) sectionChanges.push({ row, published, draft });
  }

  const [columns]: any = await db.query('SHOW COLUMNS FROM events');
  const textColumns: string[] = columns.filter((c: any) => /char|text/i.test(c.Type)).map((c: any) => c.Field);
  const [eventRows]: any = await db.query('SELECT * FROM events');
  const eventChanges = [];
  for (const row of eventRows) {
    const fields: Record<string, string> = {};
    for (const col of textColumns) {
      if (typeof row[col] === 'string' && replacePhrases(row[col]) !== row[col]) fields[col] = replacePhrases(row[col]);
    }
    if (Object.keys(fields).length) eventChanges.push({ row, fields });
  }

  sectionChanges.forEach(({ row }) => console.log(`section  ${row.page_slug}/${row.section_key}`));
  eventChanges.forEach(({ row, fields }) => console.log(`event    ${row.id} (${Object.keys(fields).join(', ')})`));
  console.log(`${sectionChanges.length} section(s) and ${eventChanges.length} event(s) need changes.`);

  if (!apply || (sectionChanges.length === 0 && eventChanges.length === 0)) {
    if (!apply && sectionChanges.length + eventChanges.length > 0) console.log('Preview only. Run again with --apply to write these changes.');
    process.exit(0);
  }

  const backupDir = path.join(process.cwd(), 'data/backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `cms-cleanup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupFile, JSON.stringify({ sections: sectionChanges.map((c) => c.row), events: eventChanges.map((c) => c.row) }, null, 2));
  console.log(`Backup written: ${path.relative(process.cwd(), backupFile)}`);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (const { row, published, draft } of sectionChanges) {
      await conn.query('UPDATE sections SET published_content = ?, draft_content = ?, updated_at = NOW() WHERE id = ?', [published, draft, row.id]);
    }
    for (const { row, fields } of eventChanges) {
      const cols = Object.keys(fields);
      await conn.query(`UPDATE events SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => fields[c]), row.id]);
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
