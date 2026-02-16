import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

function getExtensionFromFileName(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase().replace('.', '');
  return extension;
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!file || file.size <= 0) {
    return { isValid: false, error: 'Imagem inválida.' };
  }

  const mimeExtension = ALLOWED_MIME_TO_EXTENSION[file.type];
  const nameExtension = getExtensionFromFileName(file.name);

  const hasAllowedMime = Boolean(mimeExtension);
  const hasAllowedNameExtension = ALLOWED_EXTENSIONS.has(nameExtension);

  if (!hasAllowedMime || !hasAllowedNameExtension) {
    return { isValid: false, error: 'Formato de imagem inválido. Use JPG, JPEG, PNG ou WEBP.' };
  }

  return { isValid: true };
}

export async function saveUploadedImage(file: File): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error ?? 'Imagem inválida.');
  }

  const extension = ALLOWED_MIME_TO_EXTENSION[file.type] ?? getExtensionFromFileName(file.name) ?? 'jpg';
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const destinationPath = path.join(uploadsDir, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(destinationPath, fileBuffer);

  return `/uploads/${fileName}`;
}
