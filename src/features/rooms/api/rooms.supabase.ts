import { getSupabase } from '@/shared/lib/supabase'
import { RoomAlreadyExistsError } from '@/features/rooms/api/room.errors'
import type { Room } from '@/features/rooms/api/room.types'

function requireSupabase() {
  const supabase = getSupabase()
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }
  return supabase
}

export async function loadRoomFromSupabase(id: string): Promise<Room> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (data) return data as Room

  const { data: created, error: insertError } = await supabase
    .from('rooms')
    .insert({ id, content: '' })
    .select()
    .single()

  if (insertError) throw insertError
  return created as Room
}

export async function getRoomStatusFromSupabase(id: string): Promise<boolean> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('rooms')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

/** Insert only — fails if room id already exists. */
export async function createRoomFromSupabase(id: string): Promise<Room> {
  const supabase = requireSupabase()

  const { data: existing, error: selectError } = await supabase
    .from('rooms')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (selectError) throw selectError
  if (existing) throw new RoomAlreadyExistsError(id)

  const { data: created, error: insertError } = await supabase
    .from('rooms')
    .insert({ id, content: '' })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      throw new RoomAlreadyExistsError(id)
    }
    throw insertError
  }

  return created as Room
}

export async function saveRoomToSupabase(
  id: string,
  content: string,
): Promise<void> {
  const supabase = requireSupabase()

  const { error } = await supabase.from('rooms').upsert({ id, content })
  if (error) throw error
}

export function subscribeRoomFromSupabase(
  id: string,
  onChange: (content: string) => void,
): () => void {
  const supabase = getSupabase()
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`room:${id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${id}`,
      },
      (payload) => {
        const row = payload.new as Room
        onChange(row.content)
      },
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
