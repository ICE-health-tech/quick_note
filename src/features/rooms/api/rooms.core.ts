import { apiFetch } from '@/shared/lib/api-client'
import { RoomAlreadyExistsError } from '@/features/rooms/api/room.errors'
import type { Room } from '@/features/rooms/api/room.types'

type ApiResponse<T> = {
  data: T
  success: boolean
  message: string | null
}

type QuickNoteJson = {
  roomId: string
  content: string
  createdAt: string
  updatedAt: string
}

function quickNoteToRoom(note: QuickNoteJson): Room {
  return {
    id: note.roomId,
    content: note.content,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  }
}

export async function loadRoomFromCore(id: string): Promise<Room> {
  const response = await apiFetch(`/rooms/${encodeURIComponent(id)}`)

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json() as Promise<Room>
}

/** Create only — 409 if room id already exists (CoreBackend QuickNoteController). */
export async function createRoomFromCore(id: string): Promise<Room> {
  const response = await apiFetch(`/quick-note/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ content: '' }),
  })

  if (response.status === 409) {
    const body = (await response.json().catch(() => null)) as ApiResponse<void> | null
    throw new RoomAlreadyExistsError(id, body?.message ?? undefined)
  }

  if (!response.ok) {
    throw new Error(await response.text())
  }

  const body = (await response.json()) as ApiResponse<QuickNoteJson>
  return quickNoteToRoom(body.data)
}

export async function saveRoomToCore(
  id: string,
  content: string,
): Promise<Room> {
  const response = await apiFetch(`/rooms/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json() as Promise<Room>
}

export function subscribeRoomFromCore(
  id: string,
  onChange: (content: string) => void,
): () => void {
  const pollMs = 2_500
  let active = true

  const poll = async () => {
    if (!active) return

    try {
      const room = await loadRoomFromCore(id)
      onChange(room.content)
    } catch {
      // ignore transient poll errors
    }
  }

  const interval = setInterval(() => {
    void poll()
  }, pollMs)

  return () => {
    active = false
    clearInterval(interval)
  }
}
