package com.example.backend.service.implement;

import com.example.backend.dto.request.CreateCommentReq;
import com.example.backend.dto.response.LessonCommentResp;
import com.example.backend.model.LessonComment;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.LessonCommentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.LessonCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LessonCommentServiceImpl implements LessonCommentService {

        private final LessonCommentRepository commentRepository;
        private final UserRepository userRepository;
        private final CourseRepository courseRepository;

        /**
         * Lấy tất cả bình luận liên quan đến một khóa học cụ thể theo mã khóa học.
         * Mỗi bình luận sẽ bao gồm cả tên người gửi và tên khóa học để tiện cho việc
         * hiển thị phía client.
         *
         * @param courseCode Mã khóa học
         * @param pageable   Phân trang kết quả
         * @return Danh sách các bình luận thuộc khóa học đó dưới dạng DTO
         *         (LessonCommentResp)
         */
        @Override
        public Page<LessonCommentResp> getCommentsByCourseId(String courseCode, Pageable pageable) {

                Page<LessonComment> comments = commentRepository.findByCourseCode(courseCode, pageable);

                return comments.map(comment -> {
                        String senderName = userRepository.findByUserCode(comment.getSendUserId())
                                        .map(user -> user.getName())
                                        .orElse("Unknown");

                        String courseName = courseRepository.findByCourseCode(comment.getCourseCode())
                                        .map(course -> course.getCourseName())
                                        .orElse("Unknown");

                        return LessonCommentResp.builder()
                                        .senderCode(comment.getSendUserId())
                                        .senderName(senderName)
                                        .message(comment.getMessage())
                                        .commentTime(comment.getCommentTime())
                                        .courseName(courseName)
                                        .build();
                });
        }

        /**
         * Lấy bình luận mới nhất của từng khóa học (mỗi khóa 1 comment).
         * Có thể lọc thêm theo tên người gửi, tên khóa học hoặc ngày gửi bình luận.
         * 
         * Phương thức này hỗ trợ phân trang.
         *
         * @param senderName  Tên người gửi bình luận (có thể null)
         * @param courseName  Tên khóa học (có thể null)
         * @param commentDate Ngày gửi bình luận (có thể null)
         * @param pageable    Phân trang
         * @return Danh sách các bình luận mới nhất của từng khóa học (áp dụng các bộ
         *         lọc nếu có)
         */
        @Override
        public Page<LessonCommentResp> getLastCommentsEachCourse(String senderName, String courseName,
                        String commentDate, Pageable pageable) {

                Page<LessonComment> lastComments = commentRepository.findBySenderNameAndCourseNameAndCommentDateNative(
                                senderName, courseName, commentDate, pageable);
                return lastComments.map(comment -> {
                        String sender = userRepository.findByUserCode(comment.getSendUserId())
                                        .map(user -> user.getName())
                                        .orElse("Unknown");

                        String course = courseRepository.findByCourseCode(comment.getCourseCode())
                                        .map(c -> c.getCourseName())
                                        .orElse("Unknown");

                        return LessonCommentResp.builder()
                                        .senderCode(comment.getSendUserId())
                                        .senderName(sender)
                                        .message(comment.getMessage())
                                        .commentTime(comment.getCommentTime())
                                        .courseName(course)
                                        .build();
                });
        }

        /**
         * Tạo một bình luận mới cho bài học.
         * Sau khi lưu, trả về DTO của bình luận đã lưu kèm tên người gửi và tên khóa
         * học.
         *
         * @param request Thông tin bình luận cần tạo
         * @return Bình luận đã được lưu và phản hồi lại dưới dạng LessonCommentResp
         */
        @Override
        public LessonCommentResp addComment(CreateCommentReq request) {

                String senderCode = SecurityContextHolder.getContext().getAuthentication().getName();

                LessonComment comment = LessonComment.builder()
                                .courseCode(request.getCourseCode())
                                .sendUserId(senderCode)
                                .message(request.getMessage())
                                .commentTime(LocalDateTime.now())
                                .build();

                LessonComment saved = commentRepository.save(comment);

                String senderName = userRepository.findByUserCode(saved.getSendUserId())
                                .map(user -> user.getName())
                                .orElse("Unknown");

                String courseName = courseRepository.findByCourseCode(saved.getCourseCode())
                                .map(course -> course.getCourseName())
                                .orElse("Unknown");

                return LessonCommentResp.builder()
                                .senderCode(saved.getSendUserId())
                                .senderName(senderName)
                                .message(saved.getMessage())
                                .commentTime(saved.getCommentTime())
                                .courseName(courseName)
                                .build();
        }

}
