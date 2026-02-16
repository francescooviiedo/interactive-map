import db from '@/lib/db';
import { saveUploadedImage } from '@/lib/upload';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type AddressPayload = {
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
};

type JsonPayload = {
  name?: string;
  description?: string;
  initialDate?: string;
  finalDate?: string;
  address?: AddressPayload;
  location?: {
    lat?: number;
    lng?: number;
  };
};

function isIsoDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString() === value;
}

function validateDateRange(initialDate: string, finalDate: string) {
  if (!isIsoDate(initialDate) || !isIsoDate(finalDate)) {
    return 'Datas devem estar em formato ISO válido.';
  }

  const initialDateMs = Date.parse(initialDate);
  const finalDateMs = Date.parse(finalDate);

  if (finalDateMs < initialDateMs) {
    return 'A data final não pode ser anterior à data inicial.';
  }

  return null;
}

function validateBasicPayload(params: {
  name: string;
  description: string;
  initialDate: string;
  finalDate: string;
  latValue: number;
  lngValue: number;
}) {
  const { name, description, initialDate, finalDate, latValue, lngValue } = params;

  if (!name.trim()) {
    return 'Nome do evento é obrigatório.';
  }

  if (!description.trim()) {
    return 'Descrição do evento é obrigatória.';
  }

  const dateError = validateDateRange(initialDate, finalDate);
  if (dateError) {
    return dateError;
  }

  if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) {
    return 'Latitude e longitude devem ser numéricas.';
  }

  return null;
}

function getFormDataText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? '';

  let name = '';
  let description = '';
  let initialDate = '';
  let finalDate = '';
  let cep = '';
  let endereco = '';
  let numero = '';
  let bairro = '';
  let cidade = '';
  let latValue: number;
  let lngValue: number;
  let imagePath: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();

    name = getFormDataText(formData, 'name');
    description = getFormDataText(formData, 'description');
    initialDate = getFormDataText(formData, 'initial_date');
    finalDate = getFormDataText(formData, 'final_date');
    cep = getFormDataText(formData, 'cep');
    endereco = getFormDataText(formData, 'endereco');
    numero = getFormDataText(formData, 'numero');
    bairro = getFormDataText(formData, 'bairro');
    cidade = getFormDataText(formData, 'cidade');
    latValue = Number(formData.get('lat'));
    lngValue = Number(formData.get('lng'));

    const image = formData.get('image');
    if (image instanceof File && image.size > 0) {
      try {
        imagePath = await saveUploadedImage(image);
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Falha ao salvar imagem.' },
          { status: 400 },
        );
      }
    }
  } else {
    const data = (await req.json()) as JsonPayload;
    name = String(data.name ?? '');
    description = String(data.description ?? '');
    initialDate = String(data.initialDate ?? '');
    finalDate = String(data.finalDate ?? '');
    cep = String(data.address?.cep ?? '');
    endereco = String(data.address?.endereco ?? '');
    numero = String(data.address?.numero ?? '');
    bairro = String(data.address?.bairro ?? '');
    cidade = String(data.address?.cidade ?? '');
    latValue = Number(data.location?.lat);
    lngValue = Number(data.location?.lng);
  }

  const payloadError = validateBasicPayload({
    name,
    description,
    initialDate,
    finalDate,
    latValue,
    lngValue,
  });

  if (payloadError) {
    return NextResponse.json({ error: payloadError }, { status: 400 });
  }

  const stmt = db.prepare(
    `INSERT INTO events (name, description, initial_date, final_date, cep, endereco, numero, bairro, cidade, image_url, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const info = stmt.run(
    name.trim(),
    description.trim(),
    initialDate,
    finalDate,
    cep.trim(),
    endereco.trim(),
    numero.trim(),
    bairro.trim(),
    cidade.trim(),
    imagePath,
    latValue,
    lngValue
  );

  return NextResponse.json({ id: info.lastInsertRowid });
}

export async function GET() {
  const events = db.prepare('SELECT * FROM events').all();
  return NextResponse.json(events);
}
