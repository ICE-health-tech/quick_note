package com.quicknote.LinkLayer;

import com.quicknote.OrchestrationLayer.CheckHealthUseCase;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

	private final CheckHealthUseCase checkHealthUseCase;

	public HealthController(CheckHealthUseCase checkHealthUseCase) {
		this.checkHealthUseCase = checkHealthUseCase;
	}

	@GetMapping("/health")
	public ResponseEntity<Map<String, String>> health() {
		var status = checkHealthUseCase.check();
		if ("DOWN".equals(status.value())) {
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
					.body(Map.of("status", "DOWN"));
		}
		return ResponseEntity.ok(Map.of("status", "UP"));
	}
}
