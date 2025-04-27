package com.example.backend.service;

import com.example.backend.dto.request.CourseFilterReq;
import com.example.backend.dto.request.RegisterCourseReq;
import com.example.backend.dto.response.CourseResp;
import org.springframework.data.domain.Page;

public interface RegisterCourseService {

    Page<CourseResp> getRegisteredCourses(CourseFilterReq req);

    boolean registerCourse(RegisterCourseReq request);

    boolean checkRegisterCourse(Long userID, Long courseId);
}
