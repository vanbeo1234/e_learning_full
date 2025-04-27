package com.example.backend.repository;

import com.example.backend.dto.request.UpdateLessonReq;

public interface LessonDetailRepositoryCustom {
    void updateLesson(UpdateLessonReq req);
}