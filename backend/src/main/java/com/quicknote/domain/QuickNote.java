package com.quicknote.domain;

import java.time.Instant;

public record QuickNote(String roomId, String content, Instant createdAt, Instant updatedAt) {
}
