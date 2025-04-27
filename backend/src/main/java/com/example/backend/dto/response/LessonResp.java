package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * LessonResp: Thông tin bài giảng trong khóa học.
 */
@Getter
@Setter
public class LessonResp {
    private Long lessonId;
    private String lessonCode;
    private Integer lessonOrder;
    private String lessonName;
    private String videoLink;
    private String resourceLink;

    public LessonResp() {

    }

    public LessonResp(Long lessonId, String lessonCode, Integer lessonOrder, String lessonName, String videoLink,
            String resourceLink) {
        this.lessonId = lessonId;
        this.lessonCode = lessonCode;
        this.lessonOrder = lessonOrder;
        this.lessonName = lessonName;
        this.videoLink = videoLink;
        this.resourceLink = resourceLink;
    }
}
