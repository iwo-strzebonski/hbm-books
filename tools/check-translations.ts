import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { walkBook } from '../Foundry-Data/foundry-system/scripts/parsers/book-walker.js';
import { slugify } from '../Foundry-Data/foundry-system/scripts/parsers/helpers.js';

const SPELL_BOOKS = [
  'ObsidianNotes/rules/01. Księga Magii.md',
  'ObsidianNotes/rules/04. Arcanum Sanguinis.md',
  'ObsidianNotes/rules/05. Vivat Patriarcha coccineus!.md',
  'ObsidianNotes/rules/02. Klątwa Otchłani.md'
];

const overrides = JSON.parse(readFileSync('Foundry-Data/foundry-system/scripts/parsers/_id-overrides.json', 'utf8'));

const missing = [];

for (const file of SPELL_BOOKS) {
  const path = resolve(file);
  let blocks;
  try {
    blocks = walkBook(path);
  } catch(e) { continue; }
  
  for (const block of blocks) {
    if (!block.fields.some(f => f.key.toLowerCase().includes('próg') || f.key.toLowerCase().includes('poziom trud'))) continue;
    let spellName = block.name;
    if (spellName === 'Superzaklęcie - Requiem') spellName = 'Requiem';
    const slug = slugify(spellName);
    if (!overrides[slug]) {
      missing.push({ name: spellName, slug });
    }
  }
}

console.log(`Missing translations: ${missing.length}`);
missing.forEach(m => console.log(`"${m.slug}": "", // ${m.name}`));
