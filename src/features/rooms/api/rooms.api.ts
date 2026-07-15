import type { Room } from '@/features/rooms/api/room.types'
import {
  createRoomFromCore,
  getRoomStatusFromCore,
  loadRoomFromCore,
  saveRoomToCore,
  subscribeRoomFromCore,
} from '@/features/rooms/api/rooms.core'
import {
  createRoomFromSupabase,
  getRoomStatusFromSupabase,
  loadRoomFromSupabase,
  saveRoomToSupabase,
  subscribeRoomFromSupabase,
} from '@/features/rooms/api/rooms.supabase'
import { getRoomsBackend } from '@/shared/lib/rooms-config'

export type { Room } from '@/features/rooms/api/room.types'
export {
  RoomAlreadyExistsError,
  isRoomAlreadyExistsError,
} from '@/features/rooms/api/room.errors'

function requireBackend() {
  const backend = getRoomsBackend()
  if (!backend) {
    throw new Error(
      'No backend configured. Set VITE_API_URL (CoreBackend) or VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.',
    )
  }
  return backend
}

export async function loadRoom(id: string): Promise<Room> {
  const backend = requireBackend()

  if (backend === 'core') {
    return loadRoomFromCore(id)
  }

  return loadRoomFromSupabase(id)
}

export async function createRoom(id: string): Promise<Room> {
  const backend = requireBackend()

  if (backend === 'core') {
    return createRoomFromCore(id)
  }

  return createRoomFromSupabase(id)
}

export async function getRoomStatus(id: string): Promise<boolean> {
  const backend = requireBackend()

  if (backend === 'core') {
    return getRoomStatusFromCore(id)
  }

  return getRoomStatusFromSupabase(id)
}

export async function saveRoom(id: string, content: string): Promise<void> {
  const backend = requireBackend()

  if (backend === 'core') {
    await saveRoomToCore(id, content)
    return
  }

  await saveRoomToSupabase(id, content)
}

export function subscribeRoom(
  id: string,
  onChange: (content: string) => void,
): () => void {
  const backend = getRoomsBackend()
  if (!backend) return () => {}

  if (backend === 'core') {
    return subscribeRoomFromCore(id, onChange)
  }

  return subscribeRoomFromSupabase(id, onChange)
}
