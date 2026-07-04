export class RoomAlreadyExistsError extends Error {
  readonly roomId: string

  constructor(roomId: string, message?: string) {
    super(message ?? `Room already exists: ${roomId}`)
    this.name = 'RoomAlreadyExistsError'
    this.roomId = roomId
  }
}

export function isRoomAlreadyExistsError(
  error: unknown,
): error is RoomAlreadyExistsError {
  return error instanceof RoomAlreadyExistsError
}
