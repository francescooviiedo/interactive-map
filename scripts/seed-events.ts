import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { resetEventsTable, seedEvents, type SeedEvent } from '../lib/eventsAdmin';

async function ensureSeedImages(): Promise<string[]> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const sourceImage = path.join(process.cwd(), 'public', 'assets', 'images', 'logo.png');

  await mkdir(uploadsDir, { recursive: true });

  const files: string[] = [];
  for (let index = 1; index <= 5; index += 1) {
    const fileName = `seed-event-${index}.png`;
    const destination = path.join(uploadsDir, fileName);
    await copyFile(sourceImage, destination);
    files.push(`/uploads/${fileName}`);
  }

  return files;
}

function getSeedEvents(imagePaths: string[]): SeedEvent[] {
  return [
    {
      name: 'Festival da Praça Central',
      description: 'Festival cultural com música ao vivo, comidas típicas e feira de artesanato local.',
      image_url: imagePaths[0],
      initial_date: '2026-03-10T18:00:00.000Z',
      final_date: '2026-03-10T22:00:00.000Z',
      cep: '30140-110',
      endereco: 'Praça da Liberdade',
      numero: '100',
      bairro: 'Funcionários',
      cidade: 'Belo Horizonte',
      lat: -19.9321,
      lng: -43.9386,
    },
    {
      name: 'Corrida Noturna BH',
      description: 'Percurso de 5km com largada noturna, hidratação e premiação por categoria.',
      image_url: imagePaths[1],
      initial_date: '2026-03-15T22:00:00.000Z',
      final_date: '2026-03-16T00:30:00.000Z',
      cep: '30130-010',
      endereco: 'Avenida Afonso Pena',
      numero: '1350',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      lat: -19.9209,
      lng: -43.9352,
    },
    {
      name: 'Workshop de Fotografia Urbana',
      description: 'Oficina prática para iniciantes com técnicas de enquadramento e edição básica.',
      image_url: imagePaths[2],
      initial_date: '2026-04-02T13:00:00.000Z',
      final_date: '2026-04-02T17:00:00.000Z',
      cep: '30160-011',
      endereco: 'Rua da Bahia',
      numero: '1500',
      bairro: 'Lourdes',
      cidade: 'Belo Horizonte',
      lat: -19.9279,
      lng: -43.9411,
    },
    {
      name: 'Feira de Tecnologia e Startups',
      description: 'Encontro com startups locais, palestras técnicas e sessões de networking.',
      image_url: imagePaths[3],
      initial_date: '2026-04-18T12:00:00.000Z',
      final_date: '2026-04-18T21:00:00.000Z',
      cep: '31110-450',
      endereco: 'Avenida Cristiano Machado',
      numero: '4000',
      bairro: 'União',
      cidade: 'Belo Horizonte',
      lat: -19.8788,
      lng: -43.9295,
    },
    {
      name: 'Cinema ao Ar Livre no Parque',
      description: 'Sessão de cinema ao ar livre com programação familiar e praça de alimentação.',
      image_url: imagePaths[4],
      initial_date: '2026-05-08T20:00:00.000Z',
      final_date: '2026-05-08T23:00:00.000Z',
      cep: '30380-000',
      endereco: 'Avenida Otacílio Negrão de Lima',
      numero: '3000',
      bairro: 'Pampulha',
      cidade: 'Belo Horizonte',
      lat: -19.8589,
      lng: -43.9794,
    },
  ];
}

async function run() {
  const images = await ensureSeedImages();
  const events = getSeedEvents(images);

  resetEventsTable();
  const total = seedEvents(events);

  console.log(`${total} eventos de seed inseridos com sucesso.`);
}

run().catch((error: unknown) => {
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});
