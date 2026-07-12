package com.quicknote.OrchestrationLayer;

import com.quicknote.DataLayer.RoomRepository;
import com.quicknote.domain.HealthStatus;

import org.springframework.stereotype.Service;

@Service
public class CheckHealthUseCase {

	private final RoomRepository roomRepository;

	public CheckHealthUseCase(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	public HealthStatus check() {
		try {
			roomRepository.count();
			return new HealthStatus("UP");
		} catch (Exception exception) {
			return new HealthStatus("DOWN");
		}
	}
}
