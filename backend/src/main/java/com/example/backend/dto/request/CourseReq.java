package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * CourseReq: DTO dùng để tạo hoặc cập nhật khóa học nội bộ (nếu không cần
 * instructor).
 */
@Getter
@Setter
public class CourseReq {
    private String courseCode;
    private String courseName;
    private String description;
    private int lessonCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String statusCode;
}
