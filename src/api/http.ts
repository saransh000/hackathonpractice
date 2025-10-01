export const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://172.26.81.221:5000';

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  if (!res.ok) {
    const msg = isJson ? JSON.stringify(await res.json()).slice(0, 500) : await res.text();
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return (isJson ? res.json() : ({} as any)) as Promise<T>;
}
