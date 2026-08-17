/**
 * HbM: RPG v3 - Google Drive Client
 * 
 * Downloads and processes books from Google Drive for content creation
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/documents.readonly'
];

// Root of the vault (one level above .src/)
const ROOT_DIR = path.resolve(import.meta.dirname, '..');

const TOKEN_PATH = path.join(ROOT_DIR, 'gdrive-token.json');
const CREDENTIALS_PATH = path.join(import.meta.dirname, 'client_secret_837588858675-hp2m36p432m755aeuudtigo1225388i7.apps.googleusercontent.com.json');

// Book IDs will be stored here after first search
const BOOKS_CACHE_PATH = path.join(import.meta.dirname, 'data', 'books-cache.json');

export class GDriveClient {
  constructor() {
    this.auth = null;
    this.drive = null;
    this.docs = null;
  }

  /**
   * Initialize OAuth client only (without requiring token)
   */
  async initOAuth() {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
    
    this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return this;
  }

  async init() {
    await this.initOAuth();
    
    // Try to load existing token
    try {
      const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));
      this.auth.setCredentials(token);
    } catch (err) {
      await this.authenticate();
    }
    
    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.docs = google.docs({ version: 'v1', auth: this.auth });
    
    return this;
  }

  async authenticate() {
    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    console.log('\n🔐 Authorization required!');
    console.log('Please visit this URL to authorize:\n');
    console.log(authUrl);
    console.log('\nThen run: node src/gdrive-client.js auth <CODE>\n');
    process.exit(1);
  }

  async saveToken(code) {
    const { tokens } = await this.auth.getToken(code);
    this.auth.setCredentials(tokens);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('✅ Token saved successfully!');
  }

  /**
   * Search for all HbM: RPG v3 books
   */
  async searchBooks() {
    const query = "name contains 'HbM: RPG v3' and mimeType = 'application/vnd.google-apps.document' and trashed = false";
    
    const res = await this.drive.files.list({
      q: query,
      fields: 'files(id, name, modifiedTime, webViewLink, ownedByMe)',
      orderBy: 'name',
      includeItemsFromAllDrives: false,
      supportsAllDrives: false,
    });
    
    return res.data.files;
  }

  /**
   * Get document content as plain text
   */
  async getDocumentAsText(fileId) {
    const res = await this.drive.files.export({
      fileId: fileId,
      mimeType: 'text/plain',
    });
    return res.data;
  }

  /**
   * Get document content as HTML (preserves some formatting)
   */
  async getDocumentAsHtml(fileId) {
    const res = await this.drive.files.export({
      fileId: fileId,
      mimeType: 'text/html',
    });
    return res.data;
  }

  /**
   * Get document structure using Docs API (best for structured editing)
   */
  async getDocumentStructure(documentId) {
    const res = await this.docs.documents.get({
      documentId: documentId,
    });
    return res.data;
  }

  /**
   * Download a specific book by name pattern
   */
  async downloadBook(namePattern) {
    const books = await this.searchBooks();
    const book = books.find(b => b.name.toLowerCase().includes(namePattern.toLowerCase()));
    
    if (!book) {
      throw new Error(`Book not found: ${namePattern}`);
    }
    
    console.log(`📖 Downloading: ${book.name}`);
    
    const text = await this.getDocumentAsText(book.id);
    const html = await this.getDocumentAsHtml(book.id);
    
    return {
      id: book.id,
      name: book.name,
      modifiedTime: book.modifiedTime,
      text,
      html,
    };
  }

  /**
   * Download all books and save to local cache
   */
  async downloadAllBooks(outputDir = '_books') {
    await fs.mkdir(outputDir, { recursive: true });
    
    const books = await this.searchBooks();
    
    // Deduplicate by name (keep the most recently modified)
    const uniqueBooks = new Map();
    for (const book of books) {
      const existing = uniqueBooks.get(book.name);
      if (!existing || new Date(book.modifiedTime) > new Date(existing.modifiedTime)) {
        uniqueBooks.set(book.name, book);
      }
    }
    
    const results = [];
    
    for (const book of uniqueBooks.values()) {
      // Skip character sheets
      if (book.name.includes('KP v')) continue;
      
      console.log(`📖 Downloading: ${book.name}`);
      
      try {
        const text = await this.getDocumentAsText(book.id);
        const safeName = book.name.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s]/g, '').trim();
        
        // Save as markdown
        const mdPath = path.join(outputDir, `${safeName}.md`);
        await fs.writeFile(mdPath, `# ${book.name}\n\n_Last synced: ${new Date().toISOString()}_\n\n---\n\n${text}`);
        
        results.push({
          id: book.id,
          name: book.name,
          localPath: mdPath,
          modifiedTime: book.modifiedTime,
        });
      } catch (err) {
        console.error(`❌ Failed to download ${book.name}:`, err.message);
      }
    }
    
    // Save cache
    await fs.mkdir('data', { recursive: true });
    await fs.writeFile(BOOKS_CACHE_PATH, JSON.stringify(results, null, 2));
    
    return results;
  }
}

// CLI handler
if (process.argv[1].endsWith('gdrive-client.js')) {
  const client = new GDriveClient();
  const command = process.argv[2];
  
  switch (command) {
    case 'auth':
      const code = process.argv[3];
      await client.initOAuth();
      if (!code) {
        // No code provided - show auth URL
        await client.authenticate();
      } else {
        // Code provided - save token
        await client.saveToken(code);
      }
      break;
      
    case 'list':
      await client.init();
      const books = await client.searchBooks();
      console.log('\n📚 HbM: RPG v3 Books:\n');
      books.forEach(b => console.log(`  - ${b.name}`));
      break;
      
    case 'download':
      await client.init();
      const results = await client.downloadAllBooks();
      console.log(`\n✅ Downloaded ${results.length} books to _books/`);
      break;
      
    case 'get':
      const pattern = process.argv[3];
      if (!pattern) {
        console.log('Usage: node src/gdrive-client.js get <name-pattern>');
        process.exit(1);
      }
      await client.init();
      const book = await client.downloadBook(pattern);
      console.log(book.text);
      break;
      
    default:
      console.log(`
HbM: RPG v3 - Google Drive Client

Commands:
  auth <code>     - Authenticate with Google (follow OAuth flow)
  list            - List all HbM books on Google Drive
  download        - Download all books to _books/
  get <pattern>   - Get a specific book by name pattern
      `);
  }
}

export default GDriveClient;
