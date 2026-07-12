package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomEntity;
import com.quicknote.domain.QuickNote;
import com.quicknote.domain.RoomDto;

final class RoomMapper {

	private RoomMapper() {
	}

	static RoomDto toDto(RoomEntity room) {
		return new RoomDto(room.getId(), room.getContent(), room.getUpdatedAt(), room.getCreatedAt());
	}

	static QuickNote toQuickNote(RoomEntity room) {
		return new QuickNote(room.getId(), room.getContent(), room.getCreatedAt(), room.getUpdatedAt());
	}
}
