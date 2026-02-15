import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const stmt = db.prepare(`INSERT INTO events (name, cep, endereco, numero, bairro, cidade, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(
    data.name,
    data.address.cep,
    data.address.endereco,
    data.address.numero,
    data.address.bairro,
    data.address.cidade,
    data.location.lat,
    data.location.lng
  );
  return NextResponse.json({ id: info.lastInsertRowid });
}

export async function GET() {
  const events = db.prepare('SELECT * FROM events').all();
  return NextResponse.json(events);
}
