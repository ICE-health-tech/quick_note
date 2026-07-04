const baseUrl = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '/api' : '')
).replace(/\/$/, '')

export function getApiBaseUrl(): string {
  return baseUrl
}

export function isCoreBackendConfigured(): boolean {
  return baseUrl.length > 0
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers,
  })
}
