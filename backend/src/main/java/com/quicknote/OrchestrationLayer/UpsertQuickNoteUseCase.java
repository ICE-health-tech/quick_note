package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomEntity;
import com.quicknote.DataLayer.RoomRepository;
import com.quicknote.domain.QuickNote;
import com.quicknote.domain.RoomDto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpsertQuickNoteUseCase {

	private final RoomRepository roomRepository;

	public UpsertQuickNoteUseCase(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Transactional
	public QuickNote upsert(String roomId, String content) {
		var normalizedId = RoomIdRules.normalize(roomId);
		var room = roomRepository.findById(normalizedId)
				.orElseGet(() -> new RoomEntity(normalizedId, content));
		room.setContent(content);
		return RoomMapper.toQuickNote(roomRepository.save(room));
	}

	@Transactional
	public RoomDto upsertRoom(String roomId, String content) {
		var normalizedId = RoomIdRules.normalize(roomId);
		var room = roomRepository.findById(normalizedId)
				.orElseGet(() -> new RoomEntity(normalizedId, content));
		room.setContent(content);
		return RoomMapper.toDto(roomRepository.save(room));
	}
}
