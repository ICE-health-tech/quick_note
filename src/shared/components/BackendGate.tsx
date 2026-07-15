import { useQuery } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { checkBackendHealth } from '@/shared/lib/health.api'

export function useBackendHealth() {
  return useQuery({
    queryKey: ['backend-health'],
    queryFn: checkBackendHealth,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  })
}

/** Inline block for room features only — QR/share stays outside this. */
export function RoomDbBlocked({
  message,
  onRetry,
  isRetrying,
}: {
  message: string
  onRetry: () => void
  isRetrying: boolean
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-8 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-red-400">
        Rooms unavailable
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">
        Cannot connect to database
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{message}</p>
      <p className="mt-2 text-xs text-zinc-500">
        QR &amp; Share still works — switch tabs above. Rooms need a healthy DB.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {isRetrying ? 'Checking…' : 'Retry connection'}
      </button>
    </div>
  )
}

export function RoomDbLoading() {
  return (
    <p className="text-center text-sm text-zinc-400">
      Checking database connection…
    </p>
  )
}

/** @deprecated Prefer gating Join/Editor room UI with useBackendHealth — not the whole app. */
export function BackendGate({ children }: { children: ReactNode }) {
  return children
}
