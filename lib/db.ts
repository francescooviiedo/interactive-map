import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'events.sqlite');
const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  initial_date TEXT NOT NULL DEFAULT '',
  final_date TEXT NOT NULL DEFAULT '',
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
const existingColumnNames = new Set(columns.map((column) => column.name));

if (!existingColumnNames.has('image_url')) {
  db.exec('ALTER TABLE events ADD COLUMN image_url TEXT');
}

if (!existingColumnNames.has('description')) {
  db.exec("ALTER TABLE events ADD COLUMN description TEXT NOT NULL DEFAULT ''");
}

if (!existingColumnNames.has('initial_date')) {
  db.exec("ALTER TABLE events ADD COLUMN initial_date TEXT NOT NULL DEFAULT ''");
}

if (!existingColumnNames.has('final_date')) {
  db.exec("ALTER TABLE events ADD COLUMN final_date TEXT NOT NULL DEFAULT ''");
}

export default db;
