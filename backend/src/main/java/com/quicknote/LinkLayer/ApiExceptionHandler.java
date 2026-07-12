package com.quicknote.LinkLayer;

import com.quicknote.OrchestrationLayer.InvalidRoomIdException;
import com.quicknote.OrchestrationLayer.RoomAlreadyExistsException;
import com.quicknote.OrchestrationLayer.RoomNotFoundException;
import com.quicknote.domain.ApiResponse;
import com.quicknote.domain.BusinessCode;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(InvalidRoomIdException.class)
	ResponseEntity<ApiResponse<Void>> handleInvalidRoomId(InvalidRoomIdException exception) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.error(BusinessCode.INVALID_ROOM_ID));
	}

	@ExceptionHandler(RoomNotFoundException.class)
	ResponseEntity<ApiResponse<Void>> handleRoomNotFound(RoomNotFoundException exception) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiResponse.error(BusinessCode.ROOM_NOT_FOUND));
	}

	@ExceptionHandler(RoomAlreadyExistsException.class)
	ResponseEntity<ApiResponse<Void>> handleRoomAlreadyExists(RoomAlreadyExistsException exception) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(ApiResponse.error(BusinessCode.ROOM_ALREADY_EXISTS));
	}
}
