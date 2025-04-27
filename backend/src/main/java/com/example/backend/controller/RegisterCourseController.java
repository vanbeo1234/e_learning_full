package com.example.backend.controller;

import com.example.backend.dto.request.CourseFilterReq;
import com.example.backend.dto.request.RegisterCourseReq;
import com.example.backend.dto.response.CourseFilterResp;
import com.example.backend.dto.response.CourseResp;
import com.example.backend.dto.response.PaginationResp;
import com.example.backend.service.RegisterCourseService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/api/registrations")
public class RegisterCourseController {
    private final RegisterCourseService registerCourseService;
    private static final String UPLOAD_DIR = "./e_learning/backend/uploads/";

    @GetMapping
    public ResponseEntity<?> filterCourses(
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String instructorName,
            @RequestParam(required = false) String studentID,
            @RequestParam(required = false) String statusCode,
            @RequestParam(required = false) LocalDate createdDate,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "0") int pageSize) {
        try {
            // Khởi tạo CourseFilterReq với các tham số từ request
            CourseFilterReq req = new CourseFilterReq();
            req.setCourseName(courseName);
            req.setInstructorName(instructorName);
            req.setStudentId(Long.parseLong(studentID));
            req.setStatusCode(statusCode);
            req.setCreatedDate(createdDate);
            req.setPageNumber(pageNumber);
            req.setPageSize(pageSize);

            // Gọi service để lấy danh sách khóa học
            Page<CourseResp> pageResult = registerCourseService.getRegisteredCourses(req);

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

    @PostMapping
    public ResponseEntity<?> registerCourse(@RequestBody RegisterCourseReq request) {
        try {
            boolean registrationResult = registerCourseService.registerCourse(request);

            if (registrationResult) {
                return ResponseEntity.ok().body(Map.of(
                        "success", true,
                        "message", "Đăng ký khóa học thành công"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Sinh viên đã đăng ký khóa học này trước đó"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi hệ thống khi đăng ký khóa học",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/check-register-course")
    public ResponseEntity<?> checkRegisterCourse(@RequestParam Long userId, @RequestParam Long courseId) {
        try {
            boolean registrationResult = registerCourseService.checkRegisterCourse(userId,courseId);

            if (registrationResult) {
                return ResponseEntity.ok().body(Map.of(
                        "success", true,
                        "message", "Đã đăng ký"
                ));
            } else {
                return ResponseEntity.ok().body(Map.of(
                        "success", false,
                        "message", "Sinh viên chưa đăng ký khóa học này"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi hệ thống ",
                    "error", e.getMessage()
            ));
        }
    }

    private String generateUniqueFileName(Path uploadPath, String originalFileName) throws IOException {
        String fileName = originalFileName;
        String name = fileName;
        String extension = "";

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            name = fileName.substring(0, dotIndex);
            extension = fileName.substring(dotIndex);
        }

        int count = 1;
        while (Files.exists(uploadPath.resolve(fileName))) {
            fileName = name + "(" + count + ")" + extension;
            count++;
        }
        return fileName;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = generateUniqueFileName(uploadPath, file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "data", fileName,
                    "message", "Upload thành công"
            ));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi hệ thống",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
