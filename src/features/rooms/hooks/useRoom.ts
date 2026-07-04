import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadRoom, saveRoom, subscribeRoom } from '@/features/rooms/api/rooms.api'
import { isRoomsApiConfigured } from '@/shared/lib/rooms-config'

export type RoomSyncStatus = 'loading' | 'synced' | 'saving' | 'error' | 'offline'

const SAVE_DEBOUNCE_MS = 400

export function useRoom(roomId: string) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<RoomSyncStatus>('loading')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef(content)
  const statusRef = useRef(status)

  contentRef.current = content
  statusRef.current = status

  const configured = isRoomsApiConfigured()

  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => loadRoom(roomId),
    enabled: configured && Boolean(roomId),
  })

  useEffect(() => {
    if (!configured) {
      setStatus('offline')
      return
    }

    if (isLoading) {
      setStatus('loading')
      return
    }

    if (error) {
      setStatus('error')
      return
    }

    if (isFetched && data) {
      setContent(data.content)
      setStatus('synced')
    }
  }, [configured, data, error, isFetched, isLoading])

  useEffect(() => {
    if (!configured || !roomId) return

    return subscribeRoom(roomId, (remoteContent) => {
      if (statusRef.current === 'saving') return
      if (remoteContent === contentRef.current) return

      setContent(remoteContent)
      setStatus('synced')
      queryClient.setQueryData(['room', roomId], (current) =>
        current ? { ...current, content: remoteContent } : current,
      )
    })
  }, [configured, queryClient, roomId])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  const updateContent = useCallback(
    (nextContent: string) => {
      setContent(nextContent)

      if (!configured) {
        setStatus('offline')
        return
      }

      setStatus('saving')

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(async () => {
        try {
          await saveRoom(roomId, nextContent)
          setStatus('synced')
        } catch {
          setStatus('error')
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [configured, roomId],
  )

  return {
    content,
    updateContent,
    status,
    error,
    isLoading: configured && isLoading,
    isConfigured: configured,
  }
}
