package com.example.backend.repository;

import com.example.backend.model.Course;
import com.example.backend.model.Student;
import com.example.backend.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Student> findByStudent(User student);

    @Query("SELECT rc.course FROM Student rc WHERE rc.student.id = :studentId")
    Page<Course> findCoursesByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}