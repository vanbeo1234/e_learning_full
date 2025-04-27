
package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * CreateCourseReq: Yêu cầu tạo mới khóa học, có kèm danh sách giảng viên.
 */
@Getter
@Setter
public class CreateCourseReq {
    private String courseName;
    private String description;
    private String learningOutcome;
    private String backgroundImg;
    private LocalDate startDate;
    private LocalDate endDate;
    private int lessonCount;
    private String statusCode;
    private List<Long> instructorIds;
    private List<LessonDetailReq> lessons;
}
