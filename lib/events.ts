import db from '@/lib/db';

export type Event = {
  id?: number;
  name: string;
  description: string;
  initialDate: string;
  finalDate: string;
  imageUrl?: string | null;
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
  const stmt = db.prepare(
    `INSERT INTO events (name, description, initial_date, final_date, cep, endereco, numero, bairro, cidade, image_url, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const info = stmt.run(
    event.name,
    event.description,
    event.initialDate,
    event.finalDate,
    event.address.cep,
    event.address.endereco,
    event.address.numero,
    event.address.bairro,
    event.address.cidade,
    event.imageUrl ?? null,
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
      description: string;
      initial_date: string;
      final_date: string;
      cep: string;
      endereco: string;
      numero: string;
      bairro: string;
      cidade: string;
      image_url: string | null;
      lat: number;
      lng: number;
    };
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      initialDate: r.initial_date,
      finalDate: r.final_date,
      imageUrl: r.image_url,
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
