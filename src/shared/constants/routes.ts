export const ROUTES = {
  HOME: '/',
  editor: (roomId: string) => `/${encodeURIComponent(roomId)}/page`,
} as const
