package com.example.backend.service;

import com.example.backend.dto.request.StudentReq;
import com.example.backend.model.Course;

import java.util.List;

public interface StudentService {
    void enrollStudentToCourse(StudentReq request);

    List<Course> getEnrolledCourses();
}