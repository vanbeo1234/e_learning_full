package com.example.backend.service;

import com.example.backend.dto.request.UserRegisterReq;
import com.example.backend.dto.request.UserReq;
import com.example.backend.dto.response.AuthResp;

public interface AuthService {
    /**
     * Đăng ký tài khoản người dùng.
     * 
     * @param req        Thông tin đăng ký người dùng chứa các thông tin như
     *                   userCode, email, password, v.v.
     * @param authHeader Token xác thực (chỉ cần nếu người dùng là admin tạo tài
     *                   khoản admin)
     * @return AuthResp Đối tượng phản hồi chứa thông tin token, mã lỗi và thông
     *         điệp
     *         trả về sau khi đăng ký thành công hoặc thất bại.
     */
    AuthResp registerUser(UserRegisterReq req, String authHeader);

    /**
     * Đăng nhập người dùng với thông tin userCode và mật khẩu.
     * 
     * @param userLoginReq Thông tin đăng nhập người dùng, bao gồm userCode và
     *                     password.
     * @return AuthResp Đối tượng phản hồi chứa thông tin token, mã lỗi và thông
     *         điệp
     *         trả về sau khi đăng nhập thành công hoặc thất bại.
     */
    AuthResp loginUser(UserReq userLoginReq);

}
