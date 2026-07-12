package com.quicknote.LinkLayer;

import com.quicknote.OrchestrationLayer.CreateQuickNoteUseCase;
import com.quicknote.OrchestrationLayer.GetQuickNoteUseCase;
import com.quicknote.OrchestrationLayer.UpsertQuickNoteUseCase;
import com.quicknote.domain.ApiResponse;
import com.quicknote.domain.QuickNote;
import com.quicknote.domain.UpsertQuickNoteRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/quick-note")
public class QuickNoteController {

	private final CreateQuickNoteUseCase createQuickNoteUseCase;
	private final GetQuickNoteUseCase getQuickNoteUseCase;
	private final UpsertQuickNoteUseCase upsertQuickNoteUseCase;

	public QuickNoteController(
			CreateQuickNoteUseCase createQuickNoteUseCase,
			GetQuickNoteUseCase getQuickNoteUseCase,
			UpsertQuickNoteUseCase upsertQuickNoteUseCase) {
		this.createQuickNoteUseCase = createQuickNoteUseCase;
		this.getQuickNoteUseCase = getQuickNoteUseCase;
		this.upsertQuickNoteUseCase = upsertQuickNoteUseCase;
	}

	@PostMapping("/{roomId}")
	public ResponseEntity<ApiResponse<QuickNote>> create(
			@PathVariable String roomId,
			@RequestBody(required = false) UpsertQuickNoteRequest request) {
		var content = request != null ? request.content() : "";
		var note = createQuickNoteUseCase.create(roomId, content);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(note));
	}

	@GetMapping("/{roomId}")
	public ApiResponse<QuickNote> get(@PathVariable String roomId) {
		return ApiResponse.ok(getQuickNoteUseCase.get(roomId));
	}

	@PutMapping("/{roomId}")
	public ApiResponse<QuickNote> upsert(
			@PathVariable String roomId,
			@RequestBody UpsertQuickNoteRequest request) {
		var content = request != null ? request.content() : "";
		return ApiResponse.ok(upsertQuickNoteUseCase.upsert(roomId, content));
	}
}
