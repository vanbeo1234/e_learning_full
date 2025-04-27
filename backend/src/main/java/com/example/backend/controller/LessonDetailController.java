package com.example.backend.controller;

import com.example.backend.dto.request.LessonDetailReq;
import com.example.backend.dto.request.LessonReorderReq;
import com.example.backend.dto.response.LessonResp;
import com.example.backend.service.LessonDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller quản lý các API liên quan đến bài học.
 * Bao gồm các thao tác: thêm mới, cập nhật, xóa và thay đổi thứ tự bài học.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/v1/api/lesson")
public class LessonDetailController {

    @Autowired
    private LessonDetailService lessonDetailService;

    /**
     * API thêm bài học mới.
     *
     * @param request đối tượng chứa thông tin bài học cần thêm
     * @return thông tin bài học vừa được thêm (LessonResp)
     */
    @PostMapping
    public LessonResp addLesson(@RequestBody LessonDetailReq request) {
        return lessonDetailService.addLesson(request);
    }

    /**
     * API cập nhật thông tin bài học đã có.
     *
     * @param request đối tượng chứa thông tin bài học cần cập nhật
     * @return thông tin bài học sau khi cập nhật (LessonResp)
     */
    @PutMapping("/update")
    public LessonResp updateLesson(@RequestBody LessonDetailReq request) {
        return lessonDetailService.updateLesson(request);
    }

    /**
     * API sắp xếp lại thứ tự các bài học.
     *
     * @param request danh sách thứ tự bài học mới
     * @return ResponseEntity với thông báo thành công nếu sắp xếp lại thành công
     */
    @PostMapping("/reorder")
    public ResponseEntity<?> reorderLessons(@RequestBody LessonReorderReq request) {
        lessonDetailService.reorderLessons(request);
        return ResponseEntity.ok("Cập nhật thứ tự bài học thành công!");
    }

    /**
     * API xóa bài học theo ID.
     *
     * @param id ID của bài học cần xóa
     * @return ResponseEntity với thông báo xác nhận xóa thành công
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLesson(@PathVariable Long id) {
        lessonDetailService.deleteLesson(id);
        return ResponseEntity.ok("Xóa bài học thành công!");
    }

    /**
     * 
     * API lấy danh sách bài giảng theo ID khóa học
     * 
     * @param courseId ID của khóa học
     * @return ResponseEntity chứa danh sách bài giảng sắp xếp theo lessonOrder tăng
     *         dần
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResp>> getLessonsByCourseId(@PathVariable Long courseId) {
        List<LessonResp> lessons = lessonDetailService.getLessonsByCourseId(courseId);
        return ResponseEntity.ok(lessons);
    }

}
