package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * CourseDetailResp: Response chứa thông tin chi tiết khóa học, giảng viên chính
 * và danh sách bài học.
 */
@Getter
@Setter
public class CourseDetailResp {
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private String learningOutcome;
    private String backgroundImg;
    private LocalDate startDate;
    private LocalDate endDate;
    private int lessonCount;
    private String statusCode;
    private List<InstructorSimpleResp> instructors;
    private List<LessonSimpleResp> lessons;

    public CourseDetailResp(Long id, String courseCode, String courseName, String description,
            String learningOutcome, String backgroundImg, LocalDate startDate,
            LocalDate endDate, int lessonCount, String statusCode,
            List<InstructorSimpleResp> instructors, List<LessonSimpleResp> lessons) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.learningOutcome = learningOutcome;
        this.backgroundImg = backgroundImg;
        this.startDate = startDate;
        this.endDate = endDate;
        this.lessonCount = lessonCount;
        this.statusCode = statusCode;
        this.instructors = instructors;
        this.lessons = lessons;
    }
}
