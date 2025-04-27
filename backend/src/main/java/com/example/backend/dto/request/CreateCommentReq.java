package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO dùng để nhận dữ liệu khi người dùng gửi yêu cầu tạo bình luận mới.
 * Bao gồm thông tin về khóa học, bài học, người gửi và nội dung bình luận.
 */
@Getter
@Setter
public class CreateCommentReq {
    private String courseCode;
    private String message;
}