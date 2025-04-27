package com.example.backend.repository;

import com.example.backend.dto.response.LessonResp;
import com.example.backend.dto.response.LessonSimpleResp;
import com.example.backend.model.Course;
import com.example.backend.model.LessonDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonDetailRepository extends JpaRepository<LessonDetail, Long> {

        List<LessonDetail> findByCourseId(Long courseId);

        List<LessonDetail> findByCourseOrderByLessonOrderAsc(Course course);

        List<LessonDetail> findByCourse_IdOrderByLessonOrderAsc(Long courseId);

        @Query("SELECT new com.example.backend.dto.response.LessonResp(l.id, l.lessonCode, l.lessonOrder, l.lessonName, l.videoLink, l.resourceLink) "
                        +
                        "FROM LessonDetail l WHERE l.id = :lessonId")
        LessonResp findLessonRespById(Long lessonId);

        @Query("UPDATE LessonDetail l SET l.lessonName = :lessonName, l.videoLink = :videoLink, l.resourceLink = :resourceLink WHERE l.id = :lessonId")
        void updateLesson(LessonResp lessonResp);

        @Query("SELECT new com.example.backend.dto.response.LessonSimpleResp(" +
                        "l.id, l.lessonCode, l.lessonName, l.videoLink, l.resourceLink) " +
                        "FROM LessonDetail l WHERE l.course.id = :courseId ORDER BY l.lessonOrder ASC")
        List<LessonSimpleResp> findLessonsByCourseId(@Param("courseId") Long courseId);

}
