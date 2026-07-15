import { apiFetch } from '@/shared/lib/api-client'
import { RoomAlreadyExistsError } from '@/features/rooms/api/room.errors'
import type { Room } from '@/features/rooms/api/room.types'

export const BusinessCode = {
  SUCCESS: 'SUCCESS',
  INVALID_ROOM_ID: 'INVALID_ROOM_ID',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_ALREADY_EXISTS: 'ROOM_ALREADY_EXISTS',
} as const

type ApiResponse<T> = {
  code: string
  data: T
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

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return response.json() as Promise<ApiResponse<T>>
}

function requireSuccessData<T>(body: ApiResponse<T>): T {
  if (body.code !== BusinessCode.SUCCESS || body.data == null) {
    throw new Error(body.code)
  }
  return body.data
}

export async function loadRoomFromCore(id: string): Promise<Room> {
  const response = await apiFetch(`/rooms/${encodeURIComponent(id)}`)
  const body = await parseApiResponse<Room>(response)

  if (!response.ok) {
    throw new Error(body.code)
  }

  return requireSuccessData(body)
}
export async function getRoomStatusFromCore(id: string): Promise<boolean> {
  const response = await apiFetch(`/rooms/${encodeURIComponent(id)}/status`)
  const body = await parseApiResponse<boolean>(response)
  if (!response.ok) {
    throw new Error(body.code)
  }
  return requireSuccessData(body)
}
/** Create only — ROOM_ALREADY_EXISTS if room id already exists. */
export async function createRoomFromCore(id: string): Promise<Room> {
  const response = await apiFetch(`/quick-note/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ content: '' }),
  })
  const body = await parseApiResponse<QuickNoteJson>(response)

  if (body.code === BusinessCode.ROOM_ALREADY_EXISTS) {
    throw new RoomAlreadyExistsError(id)
  }

  if (!response.ok) {
    throw new Error(body.code)
  }

  return quickNoteToRoom(requireSuccessData(body))
}

export async function saveRoomToCore(
  id: string,
  content: string,
): Promise<Room> {
  const response = await apiFetch(`/rooms/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  })
  const body = await parseApiResponse<Room>(response)

  if (!response.ok) {
    throw new Error(body.code)
  }

  return requireSuccessData(body)
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
