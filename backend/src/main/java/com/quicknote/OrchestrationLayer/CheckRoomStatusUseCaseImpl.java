package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckRoomStatusUseCaseImpl implements CheckRoomStatusUseCase {

	private final RoomRepository roomRepository;

	public CheckRoomStatusUseCaseImpl(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isRoomActive(String roomId) {
		var normalizedId = RoomIdRules.normalize(roomId);
		return roomRepository.existsById(normalizedId);
	}
}
