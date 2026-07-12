package com.quicknote.OrchestrationLayer;

public class InvalidRoomIdException extends RuntimeException {

	public InvalidRoomIdException(String roomId) {
		super("Invalid room id: " + roomId);
	}
}
