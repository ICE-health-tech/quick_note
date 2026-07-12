package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomRepository;
import com.quicknote.domain.QuickNote;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetQuickNoteUseCase {

	private final RoomRepository roomRepository;

	public GetQuickNoteUseCase(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Transactional(readOnly = true)
	public QuickNote get(String roomId) {
		var normalizedId = RoomIdRules.normalize(roomId);
		var room = roomRepository.findById(normalizedId)
				.orElseThrow(() -> new RoomNotFoundException(normalizedId));
		return RoomMapper.toQuickNote(room);
	}
}
