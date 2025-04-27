package com.example.backend.service.implement;
import com.example.backend.dto.request.CourseFilterReq;
import com.example.backend.dto.request.RegisterCourseReq;
import com.example.backend.dto.response.CourseResp;
import com.example.backend.dto.response.InstructorResp;
import com.example.backend.dto.response.LessonResp;
import com.example.backend.model.Course;
import com.example.backend.model.Student;
import com.example.backend.model.User;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.RegisterCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.repository.StudentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegisterCourseServiceImpl implements RegisterCourseService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Override
    public Page<CourseResp> getRegisteredCourses(CourseFilterReq req) {
        Pageable pageable;
        if (req.getPageNumber() == 0 || req.getPageSize() == 0) {
            pageable = Pageable.unpaged();
        } else {
            pageable = PageRequest.of(req.getPageNumber(), req.getPageSize());
        }
        Long instructorId = null;

        if (req.getInstructorId() != null) {
            User user = userRepository.findById(req.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
            instructorId = user.getId();
        }
        Page<Course> page = studentRepository.findCoursesByStudentId(
                req.getStudentId(),
                pageable);
        return page.map(course -> {
            CourseResp resp = new CourseResp(
                    course.getId(),
                    course.getCourseCode(),
                    course.getCourseName(),
                    course.getDescription(),
                    course.getLearningOutcome(),
                    course.getLessonCount(),
                    course.getStartDate(),
                    course.getEndDate(),
                    course.getStatusCode(),
                    course.getBackgroundImg());

            Long courseId = course.getId();
            List<InstructorResp> instructors = courseRepository.findInstructorsByCourseId(courseId);
            List<LessonResp> lessons = courseRepository.findDetailedLessonsByCourseId(courseId);

            resp.setInstructors(instructors);
            resp.setLessons(lessons);
            resp.setCreatedBy(course.getCreatedBy());

            return resp;
        });
    }

    @Override
    public boolean registerCourse(RegisterCourseReq request) {
        try {
            // Kiểm tra sinh viên tồn tại
            User student = userRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sinh viên với ID: " + request.getStudentId()));

            // Kiểm tra khóa học tồn tại
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khóa học với ID: " + request.getCourseId()));

            // Kiểm tra đã đăng ký chưa
            if (studentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                return false;
            }

            // Tạo bản ghi đăng ký mới
            Student newStudent = new Student();
            newStudent.setStudent(student);
           newStudent.setCourse(course);

            studentRepository.save(newStudent);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean checkRegisterCourse(Long userID, Long courseId){
        User student = userRepository.findById(userID)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sinh viên với ID: " + userID));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khóa học với ID: " + courseId));
        // Kiểm tra đã đăng ký chưa
        if (studentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            return true;
        }
        return false;
    }
}