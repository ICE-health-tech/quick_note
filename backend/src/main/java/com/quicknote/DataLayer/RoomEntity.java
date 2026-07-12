package com.quicknote.DataLayer;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms", schema = "public")
public class RoomEntity {

	@Id
	@Column(name = "id", nullable = false, length = 64, updatable = false)
	private String id;

	@Column(name = "content", nullable = false, columnDefinition = "text")
	private String content = "";

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	protected RoomEntity() {
	}

	public RoomEntity(String id, String content) {
		this.id = id;
		this.content = content != null ? content : "";
	}

	@PrePersist
	void onCreate() {
		var now = Instant.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public String getId() {
		return id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content != null ? content : "";
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
