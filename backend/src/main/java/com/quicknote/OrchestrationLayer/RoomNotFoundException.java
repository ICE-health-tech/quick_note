package com.quicknote.OrchestrationLayer;

public class RoomNotFoundException extends RuntimeException {

	public RoomNotFoundException(String roomId) {
		super("Room not found: " + roomId);
	}
}
