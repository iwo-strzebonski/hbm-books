#!/usr/bin/env node

/**
 * HbM: RPG v3 - Main CLI Tool
 * 
 * Unified interface for content creation and management
 */

import { GDriveClient } from './gdrive-client.js';
import { ContentManager } from './content-manager.js';
import { formatSpellForBook, spellTemplate } from './templates/spell.js';
import { formatCreatureForBook, creatureTemplate } from './templates/creature.js';
import { formatItemForBook, itemTemplate } from './templates/item.js';
import { formatNPCForBook, npcTemplate } from './templates/npc.js';
import { formatLocationForBook, locationTemplate } from './templates/location.js';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const BOOKS = {
  'podrecznik': 'HbM: RPG v3 - Podręcznik Gry',
  'magia': 'HbM: RPG v3 - Księga Magii',
  'przewodnik': 'HbM: RPG v3 - Przewodnik Ludzkości po Magicznym Świecie',
  'bestiariusz': 'HbM: RPG v3 - Bestiariusz',
  'arcanum': 'HbM: RPG v3 - Arcanum Sanguinis',
  'kult': 'HbM: RPG v3 - Chwała Szkarłatnemu Kultowi',
  'klatwa': 'HbM: RPG v3 - Klątwa Otchłani',
};

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║         🎲 HbM: RPG v3 - Content Creation Environment 🎲          ║
╚═══════════════════════════════════════════════════════════════════╝

GOOGLE DRIVE COMMANDS:
  gdrive:auth              Authenticate with Google Drive
  gdrive:list              List all HbM books on Drive
  gdrive:sync              Download all books to local cache
  gdrive:get <book>        Get specific book content

CONTENT COMMANDS:
  new:spell                Create a new spell
  new:creature             Create a new creature/monster
  new:item                 Create a new magic item
  new:npc                  Create a new NPC
  new:location             Create a new location

  draft <book> <section>   Create a new draft for a book section
  revision <book>          Create a revision (copy-paste ready)

SEARCH & BROWSE:
  search <query>           Search across all downloaded books
  list <type>              List content (spells/creatures/items/npcs/locations)
  show <type> <name>       Show specific content item

TEMPLATES:
  template:spell           Show spell template structure
  template:creature        Show creature template structure
  template:item            Show item template structure
  template:npc             Show NPC template structure
  template:location        Show location template structure

BOOK SHORTCUTS:
  podrecznik   → Podręcznik Gry (Game Manual)
  magia        → Księga Magii (Magic Book)
  przewodnik   → Przewodnik Ludzkości (Humanity's Guide)
  bestiariusz  → Bestiariusz (Bestiary)
  arcanum      → Arcanum Sanguinis
  kult         → Chwała Szkarłatnemu Kultowi
  klatwa       → Klątwa Otchłani

Examples:
  bun run hbm gdrive:sync
  bun run hbm search "ognista kula"
  bun run hbm new:spell
  bun run hbm draft magia "Nowy Czar"
  `);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help' || command === '--help') {
    await printHelp();
    return;
  }

  const manager = new ContentManager();
  await manager.init();

  // Google Drive commands
  if (command.startsWith('gdrive:')) {
    const gdrive = new GDriveClient();
    
    switch (command) {
      case 'gdrive:auth':
        const code = args[1];
        await gdrive.initOAuth();
        if (code) {
          await gdrive.saveToken(code);
        } else {
          await gdrive.authenticate();
        }
        break;
        
      case 'gdrive:list':
        await gdrive.init();
        const books = await gdrive.searchBooks();
        console.log('\n📚 HbM: RPG v3 Books on Google Drive:\n');
        books.forEach(b => {
          const modified = new Date(b.modifiedTime).toLocaleDateString('pl-PL');
          console.log(`  📖 ${b.name}`);
          console.log(`     Last modified: ${modified}\n`);
        });
        break;
        
      case 'gdrive:sync':
        await gdrive.init();
        console.log('\n🔄 Syncing books from Google Drive...\n');
        const results = await gdrive.downloadAllBooks();
        console.log(`\n✅ Downloaded ${results.length} books to _books/`);
        results.forEach(r => console.log(`   📖 ${r.name}`));
        break;
        
      case 'gdrive:get':
        const pattern = args[1] || '';
        const bookName = BOOKS[pattern.toLowerCase()] || pattern;
        await gdrive.init();
        const book = await gdrive.downloadBook(bookName);
        console.log(book.text);
        break;
    }
    return;
  }

  // New content commands
  if (command.startsWith('new:')) {
    const type = command.split(':')[1];
    const templates = {
      spell: { template: spellTemplate, formatter: formatSpellForBook },
      creature: { template: creatureTemplate, formatter: formatCreatureForBook },
      item: { template: itemTemplate, formatter: formatItemForBook },
      npc: { template: npcTemplate, formatter: formatNPCForBook },
      location: { template: locationTemplate, formatter: formatLocationForBook },
    };
    
    if (!templates[type]) {
      console.log(`Unknown type: ${type}`);
      return;
    }
    
    const name = await prompt(`Enter ${type} name: `);
    if (!name) {
      console.log('Name is required');
      return;
    }
    
    const data = { ...templates[type].template, name };
    const filePath = await manager.saveContent(`${type}s`, name, data);
    
    console.log(`\n✅ Created ${type}: ${filePath}`);
    console.log(`\nEdit the JSON file to add details, then run:`);
    console.log(`  npm run hbm show ${type}s "${name}"`);
    return;
  }

  // Template commands
  if (command.startsWith('template:')) {
    const type = command.split(':')[1];
    const templates = {
      spell: spellTemplate,
      creature: creatureTemplate,
      item: itemTemplate,
      npc: npcTemplate,
      location: locationTemplate,
    };
    
    if (templates[type]) {
      console.log(`\n${type.toUpperCase()} TEMPLATE:\n`);
      console.log(JSON.stringify(templates[type], null, 2));
    } else {
      console.log(`Unknown template: ${type}`);
    }
    return;
  }

  // Other commands
  switch (command) {
    case 'search':
      const query = args.slice(1).join(' ');
      if (!query) {
        console.log('Usage: npm run hbm search <query>');
        return;
      }
      const searchResults = await manager.searchBooks(query);
      console.log(`\n🔍 Found ${searchResults.length} results for "${query}":\n`);
      searchResults.slice(0, 15).forEach(r => {
        console.log(`📄 ${r.file}:${r.line}`);
        console.log(`   ${r.text}`);
        console.log('');
      });
      if (searchResults.length > 15) {
        console.log(`... and ${searchResults.length - 15} more results`);
      }
      break;
      
    case 'list':
      const listType = args[1] || 'spells';
      const items = await manager.listContent(listType);
      console.log(`\n📋 ${listType} (${items.length} items):\n`);
      items.forEach(i => console.log(`  • ${i.name}`));
      break;
      
    case 'show':
      const showType = args[1];
      const showName = args.slice(2).join(' ');
      if (!showType || !showName) {
        console.log('Usage: npm run hbm show <type> <name>');
        return;
      }
      const contentItems = await manager.listContent(showType);
      const item = contentItems.find(i => 
        i.name.toLowerCase().includes(showName.toLowerCase())
      );
      if (!item) {
        console.log(`Not found: ${showName}`);
        return;
      }
      
      const formatters = {
        spells: formatSpellForBook,
        creatures: formatCreatureForBook,
        items: formatItemForBook,
        npcs: formatNPCForBook,
        locations: formatLocationForBook,
      };
      
      if (formatters[showType]) {
        console.log('\n' + formatters[showType](item) + '\n');
      } else {
        console.log(JSON.stringify(item, null, 2));
      }
      break;
      
    case 'draft':
      const draftBook = BOOKS[args[1]?.toLowerCase()] || args[1] || 'Unknown';
      const draftSection = args.slice(2).join(' ') || 'New Section';
      const draftPath = await manager.createDraft(draftBook, draftSection);
      console.log(`\n✅ Draft created: ${draftPath}`);
      break;
      
    case 'revision':
      const revBook = BOOKS[args[1]?.toLowerCase()] || args[1] || 'Unknown';
      const revSection = await prompt('Section title: ');
      const revOriginal = await prompt('Paste original text (end with empty line):\n');
      const revNew = await prompt('Paste revised text (end with empty line):\n');
      const revNotes = await prompt('Notes (optional): ');
      
      const revPath = await manager.createRevision(revBook, revSection, revOriginal, revNew, revNotes);
      console.log(`\n✅ Revision created: ${revPath}`);
      break;
      
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run "npm run hbm help" for available commands');
  }
}

main().catch(console.error);
