package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho bảng lesson_comment trong cơ sở dữ liệu.
 * Lưu trữ các bình luận của người dùng gửi trong từng bài học của một khóa học
 * cụ thể.
 */
@Entity
@Table(name = "lesson_comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "course_code")
    private String courseCode;

    @Column(name = "lesson_id")
    private Integer lessonId;

    @Column(name = "send_user_id")
    private String sendUserId;

    @Column(name = "message")
    private String message;

    @Column(name = "comment_time")
    private LocalDateTime commentTime;
}