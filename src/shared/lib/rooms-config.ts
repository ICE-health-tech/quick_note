import { isCoreBackendConfigured } from '@/shared/lib/api-client'
import { isSupabaseConfigured } from '@/shared/lib/supabase'

export type RoomsBackend = 'core' | 'supabase'

export function getRoomsBackend(): RoomsBackend | null {
  if (isCoreBackendConfigured()) return 'core'
  if (isSupabaseConfigured()) return 'supabase'
  return null
}

export function isRoomsApiConfigured(): boolean {
  return getRoomsBackend() !== null
}
