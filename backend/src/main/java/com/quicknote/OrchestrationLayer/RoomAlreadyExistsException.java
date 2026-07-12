package com.quicknote.OrchestrationLayer;

public class RoomAlreadyExistsException extends RuntimeException {

	public RoomAlreadyExistsException(String roomId) {
		super("Room already exists: " + roomId);
	}
}
