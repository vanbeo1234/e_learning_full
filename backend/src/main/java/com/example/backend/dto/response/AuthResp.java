package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO phản hồi khi người dùng đăng ký / đăng nhập.
 * Bao gồm token JWT, mã người dùng, thông điệp, mã lỗi và thông tin user nếu
 * thành công.
 */
@Getter
@Setter
@Builder
public class AuthResp {
    private String token;
    private String userCode;
    private String message;
    private Integer errorStatus;
    private Object data;
}
