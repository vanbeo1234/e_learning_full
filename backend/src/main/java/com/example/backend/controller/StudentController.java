package com.example.backend.controller;

import com.example.backend.dto.request.StudentReq;
import com.example.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/v1/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * API cho phép học viên đăng ký vào khóa học.
     *
     * @param request thông tin học viên và khóa học
     * @return ResponseEntity với mã trạng thái và thông báo
     */
    @PostMapping("/register")
    public ResponseEntity<?> enrollStudent(@RequestBody StudentReq request) {
        try {
            studentService.enrollStudentToCourse(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Học viên đã đăng ký khóa học thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi hệ thống, vui lòng thử lại sau"));
        }
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyCourses() {
        try {
            return ResponseEntity.ok(studentService.getEnrolledCourses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Không thể lấy danh sách khóa học đã đăng ký"));
        }
    }
}