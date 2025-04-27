package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * CourseResp: Response trả về thông tin khóa học cùng danh sách giảng viên và
 * bài học.
 */
@Getter
@Setter
public class CourseResp {
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private String learningOutcome;
    private String backgroundImg;
    private int lessonCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String statusCode;
    private List<InstructorResp> instructors;

    private List<LessonResp> lessons;
    private String createdBy;

    public CourseResp(Long id, String courseCode, String courseName, String description,
            String learningOutcome, int lessonCount, LocalDate startDate,
            LocalDate endDate, String statusCode, String backgroundImg) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.learningOutcome = learningOutcome;
        this.lessonCount = lessonCount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.statusCode = statusCode;
        this.backgroundImg = backgroundImg;
    }

    public CourseResp() {
    }
}
