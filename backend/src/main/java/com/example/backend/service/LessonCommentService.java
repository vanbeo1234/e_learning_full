package com.example.backend.service;

import com.example.backend.dto.request.CreateCommentReq;
import com.example.backend.dto.response.LessonCommentResp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LessonCommentService {

    /**
     * Lấy danh sách tất cả bình luận thuộc một khóa học theo mã khóa học.
     * Hỗ trợ phân trang.
     *
     * @param courseCode mã khóa học
     * @param pageable   phân trang kết quả
     * @return danh sách các bình luận thuộc khóa học đó dưới dạng DTO
     *         (LessonCommentResp)
     */
    Page<LessonCommentResp> getCommentsByCourseId(String courseCode, Pageable pageable);

    /**
     * Lấy bình luận mới nhất của từng khóa học.
     * Có thể lọc thêm theo tên người gửi, tên khóa học hoặc ngày gửi bình luận.
     *
     * @param senderName  tên người gửi bình luận (có thể null)
     * @param courseName  tên khóa học (có thể null)
     * @param commentDate ngày gửi bình luận (có thể null)
     * @param pageable    phân trang kết quả
     * @return danh sách các bình luận mới nhất của mỗi khóa học.
     */
    Page<LessonCommentResp> getLastCommentsEachCourse(String senderName, String courseName, String commentDate,
            Pageable pageable);

    /**
     * Tạo mới một bình luận và lưu vào hệ thống.
     *
     * @param request thông tin yêu cầu tạo bình luận (CreateCommentReq).
     * @return thông tin bình luận sau khi tạo (LessonCommentResp).
     */
    LessonCommentResp addComment(CreateCommentReq request);
}