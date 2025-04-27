package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonSimpleResp {
    private Long lessonId;
    private String lessonCode;
    private String lessonName;
    private String videoLink;
    private String resourceLink;

    public LessonSimpleResp(Long lessonId, String lessonCode, String lessonName, String videoLink,
            String resourceLink) {
        this.lessonId = lessonId;
        this.lessonCode = lessonCode;
        this.lessonName = lessonName;
        this.videoLink = videoLink;
        this.resourceLink = resourceLink;
    }

}
