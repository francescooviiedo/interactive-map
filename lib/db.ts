import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'events.sqlite');
const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  image_url TEXT,
  lat REAL,
  lng REAL
)`);

const columns = db.prepare('PRAGMA table_info(events)').all() as Array<{ name: string }>;
const hasImageUrl = columns.some((column) => column.name === 'image_url');
if (!hasImageUrl) {
  db.exec('ALTER TABLE events ADD COLUMN image_url TEXT');
}

export default db;
