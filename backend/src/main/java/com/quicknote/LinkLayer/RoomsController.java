package com.quicknote.LinkLayer;

import com.quicknote.OrchestrationLayer.GetOrCreateRoomUseCase;
import com.quicknote.OrchestrationLayer.UpsertQuickNoteUseCase;
import com.quicknote.domain.ApiResponse;
import com.quicknote.domain.RoomDto;
import com.quicknote.domain.SaveRoomRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoomsController {

	private final GetOrCreateRoomUseCase getOrCreateRoomUseCase;
	private final UpsertQuickNoteUseCase upsertQuickNoteUseCase;

	public RoomsController(
			GetOrCreateRoomUseCase getOrCreateRoomUseCase,
			UpsertQuickNoteUseCase upsertQuickNoteUseCase) {
		this.getOrCreateRoomUseCase = getOrCreateRoomUseCase;
		this.upsertQuickNoteUseCase = upsertQuickNoteUseCase;
	}

	@GetMapping("/rooms/{id}")
	public ApiResponse<RoomDto> load(@PathVariable String id) {
		return ApiResponse.ok(getOrCreateRoomUseCase.getOrCreate(id));
	}

	@PutMapping("/rooms/{id}")
	public ApiResponse<RoomDto> save(@PathVariable String id, @RequestBody(required = false) SaveRoomRequest request) {
		var content = request != null ? request.content() : "";
		return ApiResponse.ok(upsertQuickNoteUseCase.upsertRoom(id, content));
	}
}
