package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Request chứa danh sách ID bài học để sắp xếp lại thứ tự.
 */
@Getter
@Setter
public class LessonReorderReq {
    private List<Long> lessonIds;
}
