import db from './db';

type SeedEvent = {
  name: string;
  description: string;
  image_url: string;
  initial_date: string;
  final_date: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  lat: number;
  lng: number;
};

export function resetEventsTable(): void {
  const resetTransaction = db.transaction(() => {
    db.prepare('DELETE FROM events').run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'events'").run();
  });

  resetTransaction();
}

export function seedEvents(events: SeedEvent[]): number {
  const insertEvent = db.prepare(
    `INSERT INTO events (name, description, initial_date, final_date, cep, endereco, numero, bairro, cidade, image_url, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const runSeed = db.transaction((items: SeedEvent[]) => {
    for (const event of items) {
      insertEvent.run(
        event.name,
        event.description,
        event.initial_date,
        event.final_date,
        event.cep,
        event.endereco,
        event.numero,
        event.bairro,
        event.cidade,
        event.image_url,
        event.lat,
        event.lng,
      );
    }
  });

  runSeed(events);
  return events.length;
}

export type { SeedEvent };
