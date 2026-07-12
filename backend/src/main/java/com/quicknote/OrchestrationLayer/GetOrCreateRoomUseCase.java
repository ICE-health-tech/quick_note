package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomEntity;
import com.quicknote.DataLayer.RoomRepository;
import com.quicknote.domain.RoomDto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetOrCreateRoomUseCase {

	private final RoomRepository roomRepository;

	public GetOrCreateRoomUseCase(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Transactional
	public RoomDto getOrCreate(String roomId) {
		var normalizedId = RoomIdRules.normalize(roomId);
		var room = roomRepository.findById(normalizedId)
				.orElseGet(() -> roomRepository.save(new RoomEntity(normalizedId, "")));
		return RoomMapper.toDto(room);
	}
}
