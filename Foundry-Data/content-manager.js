/**
 * HbM: RPG v3 - Content Manager
 * 
 * Tools for creating, editing, and organizing TT-RPG content
 */

import fs from 'fs/promises';
import path from 'path';

// Content lives directly at the repo root (Obsidian-vault-friendly layout).
// Scripts live in .src/, so go up one level to reach the vault root.
const CONTENT_DIR = path.resolve(import.meta.dirname, '..');
const DRAFTS_DIR = path.join(CONTENT_DIR, '_drafts');
const REVISIONS_DIR = path.join(CONTENT_DIR, 'revisions');
const TEMPLATES_DIR = path.join(CONTENT_DIR, '_templates');

export class ContentManager {
  constructor() {
    this.initialized = false;
  }

  async init() {
    // Create directory structure (folders live at repo root)
    await fs.mkdir(DRAFTS_DIR, { recursive: true });
    await fs.mkdir(REVISIONS_DIR, { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'spells'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'creatures'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'items'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'locations'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'npcs'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'rules'), { recursive: true });
    await fs.mkdir(path.join(CONTENT_DIR, 'adventures'), { recursive: true });

    this.initialized = true;
    return this;
  }

  /**
   * Create a new draft for a specific book
   */
  async createDraft(bookName, sectionTitle, content = '') {
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = sectionTitle.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s]/g, '').trim();
    const fileName = `${timestamp}_${safeName}.md`;
    
    const draft = `---
book: "${bookName}"
section: "${sectionTitle}"
created: "${new Date().toISOString()}"
status: draft
---

# ${sectionTitle}

${content}

---
<!-- REVISION NOTES -->
<!-- Add notes about changes here -->
`;

    const filePath = path.join(DRAFTS_DIR, fileName);
    await fs.writeFile(filePath, draft);
    
    return filePath;
  }

  /**
   * Create a revision (ready to copy-paste version)
   */
  async createRevision(bookName, sectionTitle, originalText, revisedText, notes = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = sectionTitle.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s]/g, '').trim();
    const fileName = `${safeName}_rev_${timestamp}.md`;
    
    const revision = `---
book: "${bookName}"
section: "${sectionTitle}"
created: "${new Date().toISOString()}"
type: revision
---

# Revision: ${sectionTitle}

**Book:** ${bookName}
**Created:** ${new Date().toLocaleString('pl-PL')}

## Notes
${notes || '_No notes provided_'}

---

## 📋 COPY-PASTE READY TEXT

\`\`\`
${revisedText}
\`\`\`

---

## Original Text (for reference)

<details>
<summary>Click to expand original</summary>

${originalText}

</details>
`;

    const filePath = path.join(REVISIONS_DIR, fileName);
    await fs.writeFile(filePath, revision);
    
    return filePath;
  }

  /**
   * Save content by type (spell, creature, etc.)
   */
  async saveContent(type, name, data) {
    const typeDir = path.join(CONTENT_DIR, type);
    const safeName = name.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s]/g, '').trim();
    const filePath = path.join(typeDir, `${safeName}.json`);
    
    const content = {
      name,
      type,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...data
    };
    
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    return filePath;
  }

  /**
   * List all content of a type
   */
  async listContent(type) {
    const typeDir = path.join(CONTENT_DIR, type);
    try {
      const files = await fs.readdir(typeDir);
      const contents = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = JSON.parse(await fs.readFile(path.join(typeDir, file), 'utf-8'));
          contents.push(data);
        }
      }
      
      return contents;
    } catch {
      return [];
    }
  }

  /**
   * Search across all downloaded books
   */
  async searchBooks(query, booksDir = '_books') {
    const results = [];
    
    try {
      const files = await fs.readdir(booksDir);
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const content = await fs.readFile(path.join(booksDir, file), 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file,
              line: index + 1,
              text: line.trim(),
              context: lines.slice(Math.max(0, index - 2), index + 3).join('\n')
            });
          }
        });
      }
    } catch (err) {
      console.error('Search error:', err.message);
    }
    
    return results;
  }

  /**
   * Extract a section from a book
   */
  async extractSection(bookPath, startPattern, endPattern = null) {
    const content = await fs.readFile(bookPath, 'utf-8');
    const lines = content.split('\n');
    
    let capturing = false;
    let section = [];
    
    for (const line of lines) {
      if (!capturing && line.includes(startPattern)) {
        capturing = true;
      }
      
      if (capturing) {
        if (endPattern && line.includes(endPattern)) {
          break;
        }
        section.push(line);
      }
    }
    
    return section.join('\n');
  }
}

// CLI handler
if (process.argv[1].endsWith('content-manager.js')) {
  const manager = new ContentManager();
  await manager.init();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      console.log('✅ Content directories initialized!');
      break;
      
    case 'draft':
      const book = process.argv[3] || 'Unknown';
      const section = process.argv[4] || 'New Section';
      const draftPath = await manager.createDraft(book, section);
      console.log(`✅ Draft created: ${draftPath}`);
      break;
      
    case 'search':
      const query = process.argv[3];
      if (!query) {
        console.log('Usage: node src/content-manager.js search <query>');
        process.exit(1);
      }
      const results = await manager.searchBooks(query);
      console.log(`\n🔍 Found ${results.length} results for "${query}":\n`);
      results.slice(0, 10).forEach(r => {
        console.log(`📄 ${r.file}:${r.line}`);
        console.log(`   ${r.text}\n`);
      });
      break;
      
    case 'list':
      const type = process.argv[3] || 'spells';
      const items = await manager.listContent(type);
      console.log(`\n📋 ${type} (${items.length} items):\n`);
      items.forEach(i => console.log(`  - ${i.name}`));
      break;
      
    default:
      console.log(`
HbM: RPG v3 - Content Manager

Commands:
  init                        - Initialize content directories
  draft <book> <section>      - Create a new draft
  search <query>              - Search across downloaded books
  list <type>                 - List content by type (spells, creatures, etc.)
      `);
  }
}

export default ContentManager;
