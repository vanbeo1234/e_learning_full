package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO dùng để cập nhật thông tin một khóa học,
 * bao gồm thông tin cơ bản và danh sách bài giảng đi kèm.
 */
@Getter
@Setter
public class UpdateCourseReq {
    private String courseCode;
    private String courseName;
    private String description;
    private String learningOutcome;
    private String backgroundImg;
    private LocalDate startDate;
    private LocalDate endDate;
    private int lessonCount;
    private String statusCode;
    private List<UpdateLessonReq> lessons;
    private String updatedBy;
    private String instructorIds;

}
