import { apiFetch } from '@/shared/lib/api-client'
import { getRoomsBackend } from '@/shared/lib/rooms-config'
import { getSupabase } from '@/shared/lib/supabase'

export type HealthCheckResult =
  | { ok: true }
  | { ok: false; message: string }

export async function checkBackendHealth(): Promise<HealthCheckResult> {
  const backend = getRoomsBackend()

  if (!backend) {
    return {
      ok: false,
      message: 'Backend not configured. Set VITE_API_URL in .env and restart.',
    }
  }

  if (backend === 'core') {
    try {
      const response = await apiFetch('/health')

      if (!response.ok) {
        return {
          ok: false,
          message: 'Database is not connected. CoreBackend cannot reach Postgres.',
        }
      }

      const body = (await response.json()) as { status?: string }

      if (body.status !== 'UP') {
        return {
          ok: false,
          message: 'Database is not connected. Please try again later.',
        }
      }

      return { ok: true }
    } catch {
      return {
        ok: false,
        message: 'Cannot reach CoreBackend. Start the server and check your network.',
      }
    }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return { ok: false, message: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('rooms').select('id').limit(1)

  if (error) {
    return {
      ok: false,
      message: 'Database is not connected. Check Supabase URL, key, and migration.',
    }
  }

  return { ok: true }
}
