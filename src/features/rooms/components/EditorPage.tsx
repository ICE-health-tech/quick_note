import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ShareTab } from '@/features/rooms/components/ShareTab'
import { useRoom, type RoomSyncStatus } from '@/features/rooms/hooks/useRoom'
import { getRoomEditorUrl } from '@/features/rooms/utils/roomUrl'
import {
  RoomDbBlocked,
  RoomDbLoading,
  useBackendHealth,
} from '@/shared/components/BackendGate'
import { ROUTES } from '@/shared/constants/routes'

type EditorTab = 'note' | 'share'

function statusLabel(status: RoomSyncStatus): string {
  switch (status) {
    case 'loading':
      return 'Loading…'
    case 'saving':
      return 'Saving…'
    case 'synced':
      return 'Synced'
    case 'error':
      return 'Save failed'
    case 'offline':
      return 'Offline — add backend env'
  }
}

function statusColor(status: RoomSyncStatus): string {
  switch (status) {
    case 'synced':
      return 'text-emerald-400'
    case 'error':
      return 'text-red-400'
    case 'offline':
      return 'text-amber-400'
    default:
      return 'text-zinc-500'
  }
}

export function EditorPage() {
  const navigate = useNavigate()
  const { roomId = '' } = useParams()
  const decodedId = decodeURIComponent(roomId)
  const [activeTab, setActiveTab] = useState<EditorTab>('note')
  const { data: health, isLoading: healthLoading, isFetching, refetch } =
    useBackendHealth()
  const roomsOk = health?.ok === true
  const { content, updateContent, status, error, isLoading, isConfigured } =
    useRoom(decodedId)

  function createNewRoom() {
    navigate(ROUTES.HOME)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-6 sm:px-6">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Shared note
          </p>
          <h1 className="mt-1 truncate font-mono text-lg font-semibold sm:text-xl">
            {decodedId}
          </h1>
          {activeTab === 'note' ? (
            <p className={`mt-1 text-xs ${statusColor(status)}`}>
              {statusLabel(status)}
            </p>
          ) : null}
        </div>
        <div
          className="flex shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1"
          role="tablist"
          aria-label="Room views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'note'}
            onClick={() => setActiveTab('note')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'note'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Note
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'share'}
            onClick={() => setActiveTab('share')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'share'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            QR & Share
          </button>
        </div>
      </header>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-zinc-400">
          <span className="font-medium text-zinc-300">How to use:</span> type
          here — anyone with room ID{' '}
          <span className="font-mono text-zinc-200">{decodedId}</span> sees the
          same text. Tap <span className="text-zinc-300">QR &amp; Share</span>{' '}
          to send the link.{' '}
          <span className="font-medium text-zinc-300">Leave room</span> when you
          want to join a different ID (this note stays saved).
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={createNewRoom}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-300 transition hover:border-emerald-500/60 hover:bg-emerald-500/20"
          >
            New room
          </button>
          <Link
            to={ROUTES.HOME}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-center text-sm font-medium text-zinc-200 transition hover:border-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Leave room
          </Link>
        </div>
      </div>

      {activeTab === 'note' ? (
        healthLoading ? (
          <RoomDbLoading />
        ) : !roomsOk ? (
          <RoomDbBlocked
            message={
              health?.ok === false ? health.message : 'Database is not connected.'
            }
            onRetry={() => void refetch()}
            isRetrying={isFetching}
          />
        ) : (
          <>
            {!isConfigured ? (
              <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Set <code className="font-mono">VITE_API_URL</code> for
                CoreBackend (e.g. <code className="font-mono">/api</code> in
                dev), or <code className="font-mono">VITE_SUPABASE_URL</code> +{' '}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            ) : null}

            {error ? (
              <p className="mb-4 text-sm text-red-400" role="alert">
                Could not load room. Check CoreBackend or Supabase connection.
              </p>
            ) : null}

            <textarea
              value={content}
              onChange={(event) => updateContent(event.target.value)}
              disabled={isLoading}
              placeholder="Type here — anyone with this room ID sees the same note."
              spellCheck
              className="min-h-[calc(100dvh-12rem)] flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-base leading-relaxed text-zinc-100 outline-none ring-emerald-500/0 transition placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50"
            />
          </>
        )
      ) : (
        <ShareTab initialLink={getRoomEditorUrl(decodedId)} />
      )}
    </main>
  )
}
