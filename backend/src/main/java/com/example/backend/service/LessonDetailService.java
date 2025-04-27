package com.example.backend.service;

import com.example.backend.dto.request.LessonDetailReq;
import com.example.backend.dto.response.LessonResp;
import com.example.backend.dto.request.LessonReorderReq;
import java.util.List;

public interface LessonDetailService {

    LessonResp addLesson(LessonDetailReq request);

    LessonResp updateLesson(LessonDetailReq request);

    void reorderLessons(LessonReorderReq request);

    void deleteLesson(Long id);

    List<LessonResp> getLessonsByCourseId(Long courseId);

}