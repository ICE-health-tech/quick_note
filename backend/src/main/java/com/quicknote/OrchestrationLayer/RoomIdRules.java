package com.quicknote.OrchestrationLayer;

final class RoomIdRules {

	private static final String ROOM_ID_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";

	private RoomIdRules() {
	}

	static String normalize(String roomId) {
		if (roomId == null) {
			throw new InvalidRoomIdException("null");
		}
		var normalized = roomId.trim().toLowerCase();
		if (normalized.length() < 2 || normalized.length() > 64 || !normalized.matches(ROOM_ID_PATTERN)) {
			throw new InvalidRoomIdException(roomId);
		}
		return normalized;
	}
}
