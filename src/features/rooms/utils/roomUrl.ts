import { ROUTES } from '@/shared/constants/routes'

export function getRoomEditorUrl(roomId: string): string {
  return `${window.location.origin}${ROUTES.editor(roomId)}`
}
