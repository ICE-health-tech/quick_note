export function normalizeRoomId(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, '-')
}

export function isValidRoomId(id: string): boolean {
  return id.length >= 2 && id.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)
}

/** Random ID matching CoreBackend / DB format (e.g. room-k7m2x9ab). */
export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  let suffix = ''

  for (const byte of bytes) {
    suffix += chars[byte % chars.length]
  }

  return `room-${suffix}`
}
