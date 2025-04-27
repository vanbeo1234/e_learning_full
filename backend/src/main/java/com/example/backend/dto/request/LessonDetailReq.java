package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * LessonDetailReq: DTO chứa thông tin bài học cần thêm hoặc cập nhật.
 */
@Getter
@Setter
public class LessonDetailReq {
    private Long id;
    private String lessonCode;
    private Integer lessonOrder;
    private String lessonName;
    private String videoLink;
    private String resourceLink;
    private Long courseId;
}
