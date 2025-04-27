package com.example.backend.controller;

import com.example.backend.dto.request.CourseFilterReq;
import com.example.backend.dto.request.CreateCourseReq;
import com.example.backend.dto.request.UpdateCourseReq;
import com.example.backend.dto.response.CourseResp;
import com.example.backend.dto.response.PaginationResp;
import com.example.backend.service.CourseService;
import com.example.backend.dto.response.CourseDetailResp;
import com.example.backend.dto.response.CourseFilterResp;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.Map;

/**
 * Lớp điều khiển (controller) cho các yêu cầu liên quan đến khóa học.
 * Bao gồm các API để lọc, tìm kiếm, tạo mới, cập nhật và lấy thông tin chi tiết
 * khóa học.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/api/course")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<?> filterCourses(
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String instructorName,
            @RequestParam(required = false) String instructorId,
            @RequestParam(required = false) String statusCode,
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) LocalDate createdDate,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "0") int pageSize) {
        try {
            // Khởi tạo CourseFilterReq với các tham số từ request
            CourseFilterReq req = new CourseFilterReq();
            req.setCourseName(courseName);
            req.setInstructorName(instructorName);
            req.setInstructorId(instructorId);
            req.setStatusCode(statusCode);
            req.setCreatedBy(createdBy);
            req.setCreatedDate(createdDate);
            req.setPageNumber(pageNumber);
            req.setPageSize(pageSize);

            // Gọi service để lấy danh sách khóa học
            Page<CourseResp> pageResult = courseService.filterCourses(req);

            CourseFilterResp resp = new CourseFilterResp();
            resp.setErrorStatus(901);
            resp.setMessage("Lấy danh sách khóa học thành công");
            resp.setData(pageResult.getContent());

            PaginationResp pagination = new PaginationResp();
            pagination.setCurrentPage(pageResult.getNumber() + 1);
            pagination.setTotalPages(pageResult.getTotalPages());
            pagination.setTotalItems(pageResult.getTotalElements());
            resp.setPagination(pagination);

            return ResponseEntity.ok().body(Map.of("body", resp));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("body",
                    Map.of("errorStatus", 902, "message", "Dữ liệu đầu vào không hợp lệ hoặc không tồn tại")));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("body", Map.of("errorStatus", 903, "message", "Lỗi hệ thống, vui lòng thử lại sau")));
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getCourseDetail(@RequestParam Long courseId) {
        try {
            CourseDetailResp resp = courseService.getCourseDetail(courseId);

            Map<String, Object> body = Map.of(
                    "errorStatus", 901,
                    "message", "Lấy thông tin khóa học thành công",
                    "data", resp);

            return ResponseEntity.ok(Map.of("body", body));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("body", Map.of(
                            "errorStatus", 902,
                            "message", "Dữ liệu đầu vào không hợp lệ hoặc không tồn tại")));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("body", Map.of(
                            "errorStatus", 903,
                            "message", "Lỗi hệ thống, vui lòng thử lại sau")));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CreateCourseReq req) {
        try {
            CourseResp resp = courseService.createCourse(req);

            Map<String, Object> body = Map.of(
                    "errorStatus", 901,
                    "message", "Thêm khóa học thành công",
                    "data", resp);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("body", body));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("body", Map.of(
                            "errorStatus", 902,
                            "message", "Dữ liệu đầu vào không hợp lệ")));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("body", Map.of(
                            "errorStatus", 903,
                            "message", "Lỗi hệ thống, vui lòng thử lại sau")));
        }
    }


    @PutMapping
    public ResponseEntity<?> updateCourse(@RequestBody UpdateCourseReq req) {
        try {
            // Kiểm tra courseCode có null không
            if (req.getCourseCode() == null || req.getCourseCode().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "body", Map.of("errorStatus", 902, "message", "Thiếu mã khóa học (courseCode)")));
            }

            CourseResp course = courseService.getCourseByCode(req.getCourseCode());
            if (course == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "body", Map.of("errorStatus", 902, "message", "Khóa học không tồn tại")));
            }

            CourseDetailResp resp = courseService.updateCourse(req);
            return ResponseEntity.ok(Map.of("body", Map.of(
                    "errorStatus", 901, "message", "Chỉnh sửa khóa học thành công", "data", resp)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "body", Map.of("errorStatus", 902, "message", e.getMessage())));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "body", Map.of("errorStatus", 903, "message", "Lỗi hệ thống, vui lòng thử lại sau")));
        }
    }

}
