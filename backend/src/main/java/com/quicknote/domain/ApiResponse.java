package com.quicknote.domain;

public record ApiResponse<T>(String code, T data) {

	public static <T> ApiResponse<T> of(String code, T data) {
		return new ApiResponse<>(code, data);
	}

	public static <T> ApiResponse<T> ok(T data) {
		return of(BusinessCode.SUCCESS, data);
	}

	public static ApiResponse<Void> error(String code) {
		return of(code, null);
	}
}
