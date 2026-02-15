import Database from 'better-sqlite3';
import path from 'path';

// Database file in project root
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
  lat REAL,
  lng REAL
)`);

export default db;
