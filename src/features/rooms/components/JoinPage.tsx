import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShareTab } from '@/features/rooms/components/ShareTab'
import {
  createRoom,
  isRoomAlreadyExistsError,
} from '@/features/rooms/api/rooms.api'
import { isRoomsApiConfigured } from '@/shared/lib/rooms-config'
import { ROUTES } from '@/shared/constants/routes'
import {
  isValidRoomId,
  normalizeRoomId,
} from '@/features/rooms/utils/normalizeRoomId'
import { getRoomStatusFromCore } from '../api/rooms.core'

type JoinView = 'join' | 'share'

export function JoinPage() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [activeView, setActiveView] = useState<JoinView>('join')
  const [roomExists, setRoomExists] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const normalizedId = normalizeRoomId(roomId)
  const canUseId = isValidRoomId(normalizedId);
  useEffect(() => {
    if (!canUseId || !isRoomsApiConfigured()) {
      setRoomExists(false)
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      setIsChecking(true)
      try {
        const exists = await getRoomStatusFromCore(normalizedId)
        if (!cancelled) setRoomExists(exists)
      } catch {
        if (!cancelled) setRoomExists(false) // don't lock Create on network blip
      } finally {
        if (!cancelled) setIsChecking(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [normalizedId, canUseId])


  async function handleCreateRoom() {
    setError('')

    if (!isRoomsApiConfigured()) {
      setError('Backend not configured. Set VITE_API_URL in .env and restart dev server.')
      return
    }

    if (!canUseId) {
      setError('Enter a room ID to create (2–64 chars: letters, numbers, hyphens).')
      return
    }

    setIsCreating(true)
    try {
      await createRoom(normalizedId)
      navigate(ROUTES.editor(normalizedId))
    } catch (cause) {
      if (isRoomAlreadyExistsError(cause)) {
        setError(
          `Room "${normalizedId}" already exists. Use Join room to open it, or pick another ID.`,
        )
        return
      }
      setError('Could not create room. Check backend connection and try again.')
    } finally {
      setIsCreating(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!canUseId) {
      setError('Use 2–64 characters: lowercase letters, numbers, hyphens.')
      return
    }

    setError('')
    navigate(ROUTES.editor(normalizedId))
  }

  function openShareTab() {
    setError('')
    setActiveView('share')
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6">
      <header className="flex justify-end pt-6">
        <div
          className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1"
          role="tablist"
          aria-label="Home views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'join'}
            onClick={() => setActiveView('join')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeView === 'join'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Join
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'share'}
            onClick={openShareTab}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeView === 'share'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            QR & Share
          </button>
        </div>
      </header>

      {activeView === 'join' ? (
        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
              Quick Note
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Share notes across any device
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Enter the same ID on Windows, iPhone, or any browser — everyone
              sees the same note.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Room ID
              </span>
              <input
                type="text"
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value)
                  setError('')
                }}
                placeholder="e.g. coffee-meeting"
                autoComplete="off"
                autoFocus
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20"
              />
            </label>

            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            {roomExists ? (
  <p className="text-sm text-amber-400">Room already exists — use Join.</p>
) :   <button
type="button"
onClick={() => void handleCreateRoom()}
disabled={isCreating}
className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-base font-semibold text-emerald-300 transition hover:border-emerald-500/60 hover:bg-emerald-500/20 disabled:opacity-50"
>
{isCreating ? 'Creating…' : 'Create new room'}
</button>
}
          
            <p className="text-center text-xs text-zinc-500">
              Creates a new room with the ID above. Join opens an existing room.
            </p>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Join room
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="mb-6 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
              QR & Share
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Paste a link — scan the QR on iPhone or Windows to open it.
            </p>
          </div>
          <ShareTab />
        </div>
      )}
    </main>
  )
}
