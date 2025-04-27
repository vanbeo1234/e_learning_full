package com.example.backend.repository.implement;

import com.example.backend.dto.request.UpdateLessonReq;
import com.example.backend.model.LessonDetail;
import com.example.backend.repository.LessonDetailRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

/**
 * Lớp triển khai các phương thức thao tác với dữ liệu bài giảng.
 * Cung cấp các phương thức để cập nhật bài giảng.
 */
@Repository
@Transactional
public class LessonDetailRepositoryImpl implements LessonDetailRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Cập nhật thông tin bài giảng.
     * Phương thức này nhận đối tượng {@link UpdateLessonReq}, tìm kiếm bài giảng
     * theo {@code lessonId}
     * và cập nhật tên bài giảng, liên kết video, và liên kết tài nguyên của bài
     * giảng.
     *
     * @param req Đối tượng chứa thông tin cần cập nhật của bài giảng.
     *            Bao gồm {@code lessonId}, {@code lessonName}, {@code videoLink},
     *            và {@code resourceLink}.
     */
    @Override
    public void updateLesson(UpdateLessonReq req) {
        LessonDetail lesson = entityManager.find(LessonDetail.class, req.getLessonId());
        lesson.setLessonName(req.getLessonName());
        lesson.setVideoLink(req.getVideoLink());
        lesson.setResourceLink(req.getResourceLink());
    }
}
