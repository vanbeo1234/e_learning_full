package com.example.backend.service.implement;

import com.example.backend.dto.request.StudentReq;
import com.example.backend.model.Course;
import com.example.backend.model.Student;
import com.example.backend.model.User;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void enrollStudentToCourse(StudentReq request) {

        String userCode = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học viên"));

        Long studentId = student.getId();
        Long courseId = request.getCourseId();

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException("Học viên đã đăng ký khóa học này");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khóa học"));

        Student enrollment = new Student();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setProgressPercentage(0);

        enrollmentRepository.save(enrollment);
    }

    public List<Course> getEnrolledCourses() {
        String userCode = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học viên"));

        return enrollmentRepository.findByStudent(student)
                .stream()
                .map(Student::getCourse)
                .collect(Collectors.toList());
    }

}