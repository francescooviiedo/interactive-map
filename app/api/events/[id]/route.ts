import db from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const eventId = Number(id);

  if (Number.isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!event) {
    return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
  }

  return NextResponse.json(event);
}
