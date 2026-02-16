/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchData<T>(url: string, options: RequestInit): Promise<T | null> {
  const response = await fetch(url, {
    method: options.method,
    headers: options.headers,
    body: options.body,
    cache: 'no-store',
  });

  const rawBody = await response.text();
  let data: unknown = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = rawBody;
    }
  }

  if (!response.ok) {
    if (data && typeof data === 'object') {
      return data as T;
    }
    return {
      error: typeof data === 'string' ? data : 'Erro ao processar requisição',
      status: response.status,
    } as any;
  }

  return data as T;
}