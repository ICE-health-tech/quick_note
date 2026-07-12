package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomEntity;
import com.quicknote.DataLayer.RoomRepository;
import com.quicknote.domain.QuickNote;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateQuickNoteUseCase {

	private final RoomRepository roomRepository;

	public CreateQuickNoteUseCase(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Transactional
	public QuickNote create(String roomId, String content) {
		var normalizedId = RoomIdRules.normalize(roomId);
		if (roomRepository.existsById(normalizedId)) {
			throw new RoomAlreadyExistsException(normalizedId);
		}
		var room = new RoomEntity(normalizedId, content);
		return RoomMapper.toQuickNote(roomRepository.save(room));
	}
}
