package com.quicknote.domain;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RoomDto(
		String id,
		String content,
		@JsonProperty("updated_at") Instant updatedAt,
		@JsonProperty("created_at") Instant createdAt) {
}
