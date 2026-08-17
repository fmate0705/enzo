#!/usr/bin/env node
/**
 * Reports what the site is still waiting on before it can be published.
 *
 *   node scripts/check-pending.mjs        report, exit 0
 *   node scripts/check-pending.mjs --ci   report, exit 1 if anything outstanding
 *
 * Two things block a launch, and both live in the content store rather than in
 * the source: company identity fields the operator has not filled in, and legal
 * documents still flagged as drafts. The admin surfaces the same list on its
 * dashboard; this is the version a release pipeline can fail on.
 *
 * Reads the store directly rather than importing the app, so it runs without a
 * build and without a server.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = process.env.CONTENT_DATA_DIR ?? join(process.cwd(), 'data');
const CONTENT_PATH = join(DATA_DIR, 'content.json');

const COMPANY_LABELS = {
  legalName: 'Cégnév',
  seat: 'Székhely',
  registrationNumber: 'Cégjegyzékszám',
  taxNumber: 'Adószám',
  registeringCourt: 'Nyilvántartó bíróság',
  representative: 'Képviselő',
  email: 'Hivatalos e-mail cím',
  hostingProvider: 'Tárhelyszolgáltató',
  hostingLogRetention: 'Naplómegőrzési idő',
  conciliationBoard: 'Békéltető testület',
  securityContact: 'Biztonsági kapcsolat (security.txt)',
};

const DOC_LABELS = {
  impresszum: 'Impresszum',
  adatkezeles: 'Adatkezelési tájékoztató',
  cookie: 'Cookie tájékoztató',
  feltetelek: 'Felhasználási feltételek',
};

let content;
try {
  content = JSON.parse(readFileSync(CONTENT_PATH, 'utf8'));
} catch (error) {
  if (error.code === 'ENOENT') {
    // No store yet means nothing has been filled in — every field is outstanding.
    content = {
      company: Object.fromEntries(Object.keys(COMPANY_LABELS).map((k) => [k, ''])),
      legal: {},
    };
    console.log(`No content store at ${CONTENT_PATH} — reporting against an empty one.\n`);
  } else {
    console.error(`Could not read ${CONTENT_PATH}: ${error.message}`);
    process.exit(2);
  }
}

const missingCompany = Object.entries(COMPANY_LABELS)
  .filter(([key]) => !String(content.company?.[key] ?? '').trim())
  .map(([, label]) => label);

const draftDocs = Object.entries(DOC_LABELS)
  .filter(([id]) => content.legal?.[id]?.draft !== false)
  .map(([, label]) => label);

const ci = process.argv.includes('--ci');

if (missingCompany.length === 0 && draftDocs.length === 0) {
  console.log('✔ Nothing outstanding — company data complete, all legal documents approved.');
  process.exit(0);
}

if (missingCompany.length > 0) {
  console.log(`\n${missingCompany.length} céges adat hiányzik (Admin → Céges adatok):\n`);
  for (const label of missingCompany) console.log(`    ${label}`);
}

if (draftDocs.length > 0) {
  console.log(
    `\n${draftDocs.length} jogi dokumentum tervezet állapotban (Admin → Jogi szövegek):\n`,
  );
  for (const label of draftDocs) console.log(`    ${label}`);
  console.log('\n  A tervezet jelölést csak jogi szakértői jóváhagyás után vegye le.');
}

console.log('\nRészletek: docs/CONTENT-INVENTORY.md\n');
process.exit(ci ? 1 : 0);
