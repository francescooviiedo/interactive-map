

export async function fetchData(url: string, options: RequestInit) {
    const response = await fetch(url, {
        method: options.method,
        body: options.body,
      });
      return response
}