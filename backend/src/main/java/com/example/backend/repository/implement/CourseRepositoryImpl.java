package com.example.backend.repository.implement;

import com.example.backend.common.util.EmbedUtil;
import com.example.backend.dto.request.CreateCourseReq;
import com.example.backend.dto.request.LessonDetailReq;
import com.example.backend.dto.request.UpdateCourseReq;
import com.example.backend.dto.response.CourseResp;
import com.example.backend.model.Course;
import com.example.backend.model.Instructor;
import com.example.backend.model.LessonDetail;
import com.example.backend.model.User;
import com.example.backend.repository.CourseRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import com.example.backend.dto.request.UpdateLessonReq;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * Lớp triển khai các phương thức thao tác với dữ liệu liên quan đến khóa học,
 * giảng viên và bài giảng.
 * Các phương thức bao gồm: thêm mới khóa học, cập nhật thông tin khóa học, thêm
 * bài giảng, cập nhật bài giảng,
 * và lấy danh sách các khóa học kèm giảng viên, bài giảng.
 */
@Repository
@Slf4j
@Transactional
public class CourseRepositoryImpl implements CourseRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Cập nhật thông tin của một khóa học, bao gồm các trường cơ bản và danh sách
     * bài giảng nếu có.
     *
     * @param req Đối tượng yêu cầu chứa thông tin cần cập nhật cho khóa học
     */
    @Override
    public void updateCourse(UpdateCourseReq req) {

        Course course = entityManager.createQuery(
                "SELECT c FROM Course c WHERE LOWER(c.courseCode) = LOWER(:courseCode)", Course.class)
                .setParameter("courseCode", req.getCourseCode())
                .getSingleResult();

        course.setCourseName(req.getCourseName());
        course.setDescription(req.getDescription());
        course.setLearningOutcome(req.getLearningOutcome());
        course.setBackgroundImg(req.getBackgroundImg());
        course.setStartDate(req.getStartDate());
        course.setEndDate(req.getEndDate());
        course.setLessonCount(req.getLessonCount());
        course.setStatusCode(req.getStatusCode());
        course.setUpdatedBy(req.getUpdatedBy());

        entityManager.merge(course);

        if (req.getLessons() != null) {
            for (UpdateLessonReq lesson : req.getLessons()) {
                updateLessonInCourse(req.getCourseCode(), lesson);
            }
        }
        if(req.getInstructorIds() != null){
            updateInstructorToCourse(req.getInstructorIds(), course.getId());
        }

        log.info("Khóa học {} đã được cập nhật thành công", req.getCourseCode());
    }

    /**
     * Lấy danh sách tất cả khóa học kèm theo giảng viên và bài giảng.
     * 
     * @return Danh sách các khóa học kèm giảng viên và bài giảng dưới dạng DTO
     */
    @Override
    public List<CourseResp> findAllCoursesWithInstructorsAndLessons() {
        return entityManager.createQuery("""
                    SELECT new com.example.backend.dto.response.CourseResp(
                        c.id, c.courseCode, c.courseName, c.description, c.learningOutcome, c.lessonCount,
                        c.startDate, c.endDate, c.statusCode, c.backgroundImg)
                    FROM Course c
                """, CourseResp.class).getResultList();
    }

    /**
     * Thêm giảng viên vào một khóa học.
     * 
     * @param courseCode Mã khóa học mà giảng viên sẽ được thêm vào
     * @param instructor Giảng viên cần thêm vào khóa học
     */
    @Override
    public void addInstructorToCourse(String courseCode, User instructor) {
        Course course = entityManager.createQuery(
                "SELECT c FROM Course c WHERE LOWER(c.courseCode) = LOWER(:courseCode)", Course.class)
                .setParameter("courseCode", courseCode)
                .getSingleResult();

        Instructor ins = Instructor.builder()
                .course(course)
                .instructor(instructor)
                .build();

        entityManager.persist(ins);
    }

    /**
     * Tạo một khóa học mới và lưu vào cơ sở dữ liệu.
     * 
     * @param req       Đối tượng chứa thông tin khóa học cần tạo
     * @param createdBy Người tạo khóa học
     * @param imagePath Đường dẫn tới hình ảnh nền của khóa học
     * @return Đối tượng DTO phản hồi thông tin khóa học vừa tạo
     */
    @Override
    public CourseResp createCourse(CreateCourseReq req, String createdBy, String imagePath) {
        Course course = Course.builder()
                .courseCode(generateCourseCode())
                .courseName(req.getCourseName())
                .description(req.getDescription())
                .learningOutcome(req.getLearningOutcome())
                .backgroundImg(EmbedUtil.convertImageToFullPath(imagePath))
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .lessonCount(req.getLessonCount())
                .statusCode(req.getStatusCode())
                .createdBy(createdBy)
                .build();

        entityManager.persist(course);

        return new CourseResp(
                course.getId(), course.getCourseCode(), course.getCourseName(),
                course.getDescription(), course.getLearningOutcome(), course.getLessonCount(),
                course.getStartDate(), course.getEndDate(), course.getStatusCode(), course.getBackgroundImg());
    }

    /**
     * Lấy ID của khóa học dựa trên mã khóa học.
     * 
     * @param courseCode Mã khóa học cần tìm
     * @return ID của khóa học
     */
    @Override
    public Long findCourseIdByCourseCode(String courseCode) {
        return entityManager.createQuery(
                "SELECT c.id FROM Course c WHERE LOWER(c.courseCode) = LOWER(:courseCode)", Long.class)
                .setParameter("courseCode", courseCode)
                .getSingleResult();
    }

    /**
     * Tạo mã khóa học mới dựa trên số lượng khóa học hiện tại.
     * 
     * @return Mã khóa học mới
     */
    private String generateCourseCode() {
        Long count = entityManager.createQuery("SELECT COUNT(c) FROM Course c", Long.class).getSingleResult();
        return "KH" + String.format("%03d", count + 1);
    }

    /**
     * Thêm bài giảng vào khóa học với lessonCode tự sinh.
     *
     * @param courseCode Mã khóa học mà bài giảng sẽ được thêm vào
     * @param lessonReq  Thông tin bài giảng cần thêm (không cần truyền lessonCode)
     */
    @Override
    public void addLessonToCourse(String courseCode, LessonDetailReq lessonReq) {
        Course course = entityManager.createQuery(
                "SELECT c FROM Course c WHERE LOWER(c.courseCode) = LOWER(:courseCode)", Course.class)
                .setParameter("courseCode", courseCode)
                .getSingleResult();

        String generatedLessonCode = generateLessonCode(courseCode, course.getId());

        LessonDetail lesson = LessonDetail.builder()
                .lessonCode(generatedLessonCode)
                .lessonOrder(lessonReq.getLessonOrder())
                .lessonName(lessonReq.getLessonName())
                .videoLink(EmbedUtil.convertYoutubeUrlToEmbed(lessonReq.getVideoLink()))
                .resourceLink(EmbedUtil.convertResourceLink(lessonReq.getResourceLink()))
                .course(course)
                .build();

        entityManager.persist(lesson);
        log.info("Đã thêm bài giảng '{}' với mã '{}' vào khóa học {}", lesson.getLessonName(), generatedLessonCode,
                courseCode);
    }

    /**
     * Sinh mã bài giảng dựa theo số lượng hiện có trong một khóa học.
     *
     * @param courseCode mã khóa học
     * @param courseId   id khóa học
     * @return mã bài giảng dạng KH043_L001
     */
    private String generateLessonCode(String courseCode, Long courseId) {
        Long count = entityManager.createQuery(
                "SELECT COUNT(l) FROM LessonDetail l WHERE l.course.id = :courseId", Long.class)
                .setParameter("courseId", courseId)
                .getSingleResult();

        return courseCode + "_L" + String.format("%03d", count + 1);
    }

    /**
     * Cập nhật thông tin một bài giảng trong khóa học theo courseCode và
     * lessonCode.
     *
     * @param courseCode mã khóa học cần cập nhật
     * @param lessonReq  đối tượng chứa thông tin bài học cần cập nhật
     */
    @Override
    public void updateLessonInCourse(String courseCode, UpdateLessonReq lessonReq) {
        try {

            List<LessonDetail> lessons = entityManager.createQuery(
                    "SELECT l FROM LessonDetail l WHERE l.id = :lessonId AND l.course.courseCode = :courseCode",
                    LessonDetail.class)
                    .setParameter("lessonId", lessonReq.getLessonId())
                    .setParameter("courseCode", courseCode)
                    .getResultList();

            if (lessons.isEmpty()) {
                throw new IllegalArgumentException(
                        "Không tìm thấy bài học với mã " + lessonReq.getLessonId() + " trong khóa học " + courseCode);
            }

            LessonDetail lesson = lessons.get(0);

            lesson.setLessonName(lessonReq.getLessonName());
            lesson.setVideoLink(lessonReq.getVideoLink());
            lesson.setResourceLink(lessonReq.getResourceLink());

            entityManager.flush();

        } catch (NoResultException e) {
            log.error("Không tìm thấy bài học với lessonId {} và courseCode {}", lessonReq.getLessonId(), courseCode);
            throw new RuntimeException("Không tìm thấy bài học với mã " + lessonReq.getLessonId());
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật bài học: {}", e.getMessage(), e);
            throw new RuntimeException("Cập nhật bài học thất bại: " + e.getMessage());
        }
    }

    /**
     * Xóa tất cả giảng viên của khóa học.
     * 
     * @param courseCode Mã khóa học
     */
    @Override
    public void removeInstructorsFromCourse(String courseCode) {
        entityManager.createQuery(
                "DELETE FROM Instructor i WHERE i.course.courseCode = :courseCode")
                .setParameter("courseCode", courseCode)
                .executeUpdate();
    }

    public List<User> findAllById(List<Long> instructorIds) {
        return entityManager.createQuery(
                "SELECT u FROM User u WHERE u.id IN :instructorIds", User.class)
                .setParameter("instructorIds", instructorIds)
                .getResultList();
    }

    @Override
    public void updateInstructorToCourse(String userCode, Long courseID) {
        User user = entityManager.createQuery(
                        "SELECT u FROM User u WHERE u.userCode = :userCode", User.class)
                .setParameter("userCode", userCode)
                .getSingleResult();

        Instructor instructorEnrollment = entityManager.createQuery(
                        "SELECT i FROM Instructor i WHERE i.course.id = :courseID", Instructor.class)
                .setParameter("courseID", courseID)
                .getSingleResult();

        if (user == null || instructorEnrollment == null) {
            throw new IllegalArgumentException("User hoặc InstructorEnrollment không tồn tại");
        }
        instructorEnrollment.setInstructor(user);
        entityManager.merge(instructorEnrollment);
    }

}
