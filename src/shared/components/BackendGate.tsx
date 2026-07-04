import { useQuery } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { checkBackendHealth } from '@/shared/lib/health.api'

interface BackendGateProps {
  children: ReactNode
}

function BlockedScreen({
  message,
  onRetry,
  isRetrying,
}: {
  message: string
  onRetry: () => void
  isRetrying: boolean
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-red-400">
        Service unavailable
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Cannot connect to database
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{message}</p>
      <p className="mt-3 text-xs text-zinc-500">
        Quick Note is blocked until the backend and database are healthy.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {isRetrying ? 'Checking…' : 'Retry connection'}
      </button>
    </main>
  )
}

function LoadingScreen() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-zinc-400">Checking database connection…</p>
    </main>
  )
}

export function BackendGate({ children }: BackendGateProps) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['backend-health'],
    queryFn: checkBackendHealth,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!data?.ok) {
    return (
      <BlockedScreen
        message={data?.message ?? 'Database is not connected.'}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    )
  }

  return children
}
