package com.example.backend.repository;

import com.example.backend.dto.request.CreateCourseReq;
import com.example.backend.dto.request.LessonDetailReq;
import com.example.backend.dto.request.UpdateCourseReq;
import com.example.backend.dto.request.UpdateLessonReq;
import com.example.backend.dto.response.CourseResp;
import java.util.List;
import com.example.backend.model.User;

public interface CourseRepositoryCustom {
    void updateCourse(UpdateCourseReq req);

    List<CourseResp> findAllCoursesWithInstructorsAndLessons();

    CourseResp createCourse(CreateCourseReq req, String createdBy, String imagePath);

    void addInstructorToCourse(String courseCode, User instructor);

    Long findCourseIdByCourseCode(String courseCode);

    void addLessonToCourse(String courseCode, LessonDetailReq lessonReq);

    void updateLessonInCourse(String courseCode, UpdateLessonReq lessonReq);

    /**
     * Xóa tất cả giảng viên của khóa học.
     * 
     * @param courseCode Mã khóa học.
     */
    void removeInstructorsFromCourse(String courseCode);

    void updateInstructorToCourse(String userCode, Long courseID);
}
