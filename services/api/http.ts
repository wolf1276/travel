import { ApiError, type ApiErrorBody } from '@/types/api';

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const body: ApiErrorBody = await response
      .json()
      .catch(() => ({ error: response.statusText || 'Request failed' }));
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
