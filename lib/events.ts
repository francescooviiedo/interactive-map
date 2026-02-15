import db from '@/lib/db';

export type Event = {
  id?: number;
  name: string;
  address: {
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
  };
  location: {
    lat: number | null;
    lng: number | null;
  };
};

export function saveEvent(event: Event): number {
  const stmt = db.prepare(`INSERT INTO events (name, cep, endereco, numero, bairro, cidade, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(
    event.name,
    event.address.cep,
    event.address.endereco,
    event.address.numero,
    event.address.bairro,
    event.address.cidade,
    event.location.lat,
    event.location.lng
  );
  return Number(info.lastInsertRowid);
}

export function getEvents(): Event[] {
  const rows = db.prepare('SELECT * FROM events').all();
  return rows.map(row => {
    const r = row as {
      id: number;
      name: string;
      cep: string;
      endereco: string;
      numero: string;
      bairro: string;
      cidade: string;
      lat: number;
      lng: number;
    };
    return {
      id: r.id,
      name: r.name,
      address: {
        cep: r.cep,
        endereco: r.endereco,
        numero: r.numero,
        bairro: r.bairro,
        cidade: r.cidade,
      },
      location: {
        lat: r.lat,
        lng: r.lng,
      },
    };
  });
}
