package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLessonReq {
    private Long lessonId;
    private Integer lessonOrder;
    private String lessonName;
    private String videoLink;
    private String resourceLink;
}
