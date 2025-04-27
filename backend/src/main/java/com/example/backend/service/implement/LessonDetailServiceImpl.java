package com.example.backend.service.implement;

import com.example.backend.dto.response.LessonResp;
import com.example.backend.common.util.EmbedUtil;
import com.example.backend.dto.request.LessonDetailReq;
import com.example.backend.dto.request.LessonReorderReq;
import com.example.backend.model.Course;
import com.example.backend.model.LessonDetail;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.LessonDetailRepository;
import com.example.backend.service.LessonDetailService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Triển khai các nghiệp vụ liên quan đến bài học (LessonDetailService).
 */
@Service
public class LessonDetailServiceImpl implements LessonDetailService {

    @Autowired
    private LessonDetailRepository lessonDetailRepository;

    @Autowired
    private CourseRepository courseRepository;

    /**
     * 
     * Hàm dùng để chuyển đổi từ entity LessonDetail sang DTO LessonResp
     * phục vụ cho việc trả dữ liệu về frontend theo định dạng chuẩn.
     * 
     * @param lesson đối tượng bài học từ DB
     * @return đối tượng phản hồi DTO gửi về frontend
     */
    private LessonResp mapToResp(LessonDetail lesson) {
        LessonResp resp = new LessonResp();
        resp.setLessonId(lesson.getId());
        resp.setLessonCode(lesson.getLessonCode());
        resp.setLessonOrder(lesson.getLessonOrder());
        resp.setLessonName(lesson.getLessonName());
        resp.setVideoLink(lesson.getVideoLink());
        resp.setResourceLink(lesson.getResourceLink());
        return resp;
    }

    /**
     * Thêm mới một bài học vào cơ sở dữ liệu.
     *
     * @param request thông tin bài học cần thêm
     * @return đối tượng LessonResp phản hồi sau khi thêm thành công
     */
    @Override
    public LessonResp addLesson(LessonDetailReq request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Xác định lessonOrder tự động nếu chưa được truyền
        Integer lessonOrder = request.getLessonOrder();
        if (lessonOrder == null) {
            List<LessonDetail> existingLessons = lessonDetailRepository.findByCourseOrderByLessonOrderAsc(course);
            lessonOrder = existingLessons.isEmpty() ? 1
                    : existingLessons.get(existingLessons.size() - 1).getLessonOrder() + 1;
        }

        // Tự sinh lessonCode nếu không có
        String lessonCode = request.getLessonCode();
        if (lessonCode == null || lessonCode.trim().isEmpty()) {
            lessonCode = course.getCourseCode() + "_L" + String.format("%03d", lessonOrder);
        }

        LessonDetail lesson = LessonDetail.builder()
                .lessonCode(lessonCode)
                .lessonOrder(lessonOrder)
                .lessonName(request.getLessonName())
                .videoLink(EmbedUtil.convertYoutubeUrlToEmbed(request.getVideoLink()))
                .resourceLink(EmbedUtil.convertResourceLink(request.getResourceLink()))
                .course(course)
                .build();

        LessonDetail saved = lessonDetailRepository.save(lesson);
        return mapToResp(saved);
    }

    /**
     * Cập nhật lại thứ tự các bài học dựa trên danh sách ID được gửi từ frontend.
     *
     * @param request danh sách ID của các bài học theo thứ tự mới
     */
    @Override
    public void reorderLessons(LessonReorderReq request) {
        List<Long> ids = request.getLessonIds();

        List<LessonDetail> lessons = lessonDetailRepository.findAllById(ids);

        Map<Long, LessonDetail> lessonMap = lessons.stream()
                .collect(Collectors.toMap(LessonDetail::getId, l -> l));

        List<LessonDetail> reordered = new ArrayList<>();
        int order = 1;
        for (Long id : ids) {
            LessonDetail lesson = lessonMap.get(id);
            if (lesson != null) {
                lesson.setLessonOrder(order++);
                reordered.add(lesson);
            }
        }

        lessonDetailRepository.saveAll(reordered);
    }

    /**
     * Cập nhật thông tin của một bài học đã có.
     *
     * @param request thông tin bài học cần cập nhật
     * @return phản hồi chứa thông tin bài học sau khi cập nhật
     */
    @Override
    public LessonResp updateLesson(LessonDetailReq request) {
        LessonDetail lesson = lessonDetailRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            lesson.setCourse(course);
        }

        lesson.setLessonOrder(request.getLessonOrder());
        lesson.setLessonName(request.getLessonName());
        lesson.setVideoLink(EmbedUtil.convertYoutubeUrlToEmbed(request.getVideoLink()));
        lesson.setResourceLink(EmbedUtil.convertResourceLink(request.getResourceLink()));

        LessonDetail updated = lessonDetailRepository.save(lesson);
        return mapToResp(updated);
    }

    /**
     * Xóa bài học theo ID.
     *
     * @param id ID của bài học cần xóa
     */
    @Override
    public void deleteLesson(Long id) {
        LessonDetail lesson = lessonDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + id));
        lessonDetailRepository.delete(lesson);
    }

    /**
     * 
     * Lấy danh sách bài giảng theo khóa học, sắp xếp theo lessonOrder tăng dần.
     * 
     * @param courseId ID của khóa học
     * @return Danh sách bài giảng LessonResp
     */
    @Override
    public List<LessonResp> getLessonsByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return lessonDetailRepository.findByCourseOrderByLessonOrderAsc(course)
                .stream()
                .map(this::mapToResp)
                .collect(Collectors.toList());
    }

}
