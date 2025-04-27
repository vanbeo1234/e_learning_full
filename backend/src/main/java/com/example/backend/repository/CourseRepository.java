package com.example.backend.repository;

import com.example.backend.dto.response.CourseResp;
import com.example.backend.dto.response.InstructorResp;
import com.example.backend.dto.response.LessonResp;

import com.example.backend.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository thao tác với bảng COURSE trong database.
 * Cung cấp các phương thức tìm kiếm, cập nhật, và lấy thông tin liên quan đến
 * khóa học,
 * bao gồm bài học và giảng viên của khóa học.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, CourseRepositoryCustom {

        /**
         * Tìm khóa học theo mã khóa học (courseCode) và trả về {@link Optional}.
         *
         * @param courseCode Mã khóa học
         * @return Optional chứa khóa học nếu tìm thấy, ngược lại trả về
         *         {@link Optional#empty()}
         */
        Optional<Course> findByCourseCode(String courseCode);

        /**
         * Tìm khóa học theo mã khóa học (courseCode) và trả về {@link Optional}, bỏ qua
         * phân biệt chữ hoa chữ thường.
         *
         * @param courseCode Mã khóa học
         * @return Optional chứa khóa học nếu tìm thấy, ngược lại trả về
         *         {@link Optional#empty()}
         */
        @Query("SELECT c FROM Course c WHERE LOWER(c.courseCode) = LOWER(:courseCode)")
        Optional<Course> findByCourseCodeIgnoreCase(@Param("courseCode") String courseCode);

        /**
         * Tìm kiếm khóa học theo nhiều tiêu chí mà không sử dụng phân trang.
         *
         * @param courseName     Tên khóa học
         * @param instructorName Tên giảng viên
         * @param createdDate    Ngày tạo khóa học
         * @param statusCode     Trạng thái khóa học
         * @return Danh sách các khóa học thỏa mãn điều kiện tìm kiếm
         */
        @Query(value = """
                        SELECT DISTINCT c.* FROM COURSE c
                        LEFT JOIN INSTRUCTOR_ENROLLMENT ie ON c.ID = ie.COURSE_ID
                        LEFT JOIN USER u ON ie.INSTRUCTOR_ID = u.ID
                        WHERE (:courseName IS NULL OR c.COURSE_NAME LIKE CONCAT('%', :courseName, '%'))
                          AND (:instructorName IS NULL OR u.NAME LIKE CONCAT('%', :instructorName, '%'))
                          AND (:createdDate IS NULL OR DATE(c.CREATED_AT) = :createdDate)
                          AND (:statusCode IS NULL OR c.STATUS_CODE = :statusCode)
                        """, nativeQuery = true)
        List<Course> searchCourses(
                        @Param("courseName") String courseName,
                        @Param("instructorName") String instructorName,
                        @Param("createdDate") LocalDate createdDate,
                        @Param("statusCode") String statusCode);

        /**
         * Tìm kiếm khóa học theo nhiều tiêu chí với phân trang.
         *
         * @param courseName     Tên khóa học
         * @param instructorName Tên giảng viên
         * @param createdDate    Ngày tạo khóa học
         * @param statusCode     Trạng thái khóa học
         * @param instructorId      Người tạo khóa học
         * @param pageable       Phân trang kết quả
         * @return Một trang các khóa học thỏa mãn điều kiện tìm kiếm
         */
        @Query(value = """
        SELECT DISTINCT c.* FROM COURSE c
        LEFT JOIN INSTRUCTOR_ENROLLMENT ie ON c.ID = ie.COURSE_ID
        LEFT JOIN USER u ON ie.INSTRUCTOR_ID = u.ID
        WHERE (:courseName IS NULL OR c.COURSE_NAME LIKE CONCAT('%', :courseName, '%'))
          AND (:instructorName IS NULL OR u.NAME LIKE CONCAT('%', :instructorName, '%'))
          AND (:createdDate IS NULL OR DATE(c.CREATED_AT) = :createdDate)
          AND (:statusCode IS NULL OR c.STATUS_CODE = :statusCode)
          AND (:instructorId IS NULL OR ie.INSTRUCTOR_ID = :instructorId)
        """,
                countQuery = """
        SELECT COUNT(DISTINCT c.ID) FROM COURSE c
        LEFT JOIN INSTRUCTOR_ENROLLMENT ie ON c.ID = ie.COURSE_ID
        LEFT JOIN USER u ON ie.INSTRUCTOR_ID = u.ID
        WHERE (:courseName IS NULL OR c.COURSE_NAME LIKE CONCAT('%', :courseName, '%'))
          AND (:instructorName IS NULL OR u.NAME LIKE CONCAT('%', :instructorName, '%'))
          AND (:createdDate IS NULL OR DATE(c.CREATED_AT) = :createdDate)
          AND (:statusCode IS NULL OR c.STATUS_CODE = :statusCode)
          AND (:instructorId IS NULL OR ie.INSTRUCTOR_ID = :instructorId)
        """,
                nativeQuery = true)
        Page<Course> searchCoursesPaging(
                @Param("courseName") String courseName,
                @Param("instructorName") String instructorName,
                @Param("createdDate") LocalDate createdDate,
                @Param("statusCode") String statusCode,
                @Param("instructorId") Long instructorId,
                Pageable pageable);

        /**
         * Tìm khóa học và trả về thông tin khóa học dưới dạng {@link CourseResp}.
         *
         * @param courseCode Mã khóa học
         * @return Optional chứa đối tượng {@link CourseResp} nếu tìm thấy khóa học,
         *         ngược lại trả về {@link Optional#empty()}
         */
        @Query("SELECT new com.example.backend.dto.response.CourseResp(c.id, c.courseCode, c.courseName, c.description, c.learningOutcome, c.lessonCount, "
                        + "c.startDate, c.endDate, c.statusCode, c.backgroundImg) FROM Course c WHERE c.courseCode = :courseCode")
        Optional<CourseResp> findCourseRespByCourseCode(@Param("courseCode") String courseCode);

        /**
         * Lấy danh sách các bài học chi tiết của khóa học dưới dạng {@link LessonResp}.
         *
         * @param courseId ID khóa học
         * @return Danh sách các bài học của khóa học dưới dạng {@link LessonResp}
         */
        @Query("SELECT new com.example.backend.dto.response.InstructorResp(u.id, u.name, u.userCode, u.email, u.phone, u.dateOfBirth, u.roleId, u.statusCode, u.experience) "
                        + "FROM Instructor i JOIN i.instructor u WHERE i.course.id = :courseId")
        List<InstructorResp> findInstructorsByCourseId(@Param("courseId") Long courseId);

        @Query("SELECT new com.example.backend.dto.response.LessonResp(l.id, l.lessonCode, l.lessonOrder, l.lessonName, l.videoLink, l.resourceLink) "
                        +
                        "FROM LessonDetail l WHERE l.course.id = :courseId")
        List<LessonResp> findDetailedLessonsByCourseId(@Param("courseId") Long courseId);

        /**
         * Lấy danh sách giảng viên của khóa học dưới dạng {@link InstructorResp}.
         *
         * @param courseId ID khóa học
         * @return Danh sách giảng viên của khóa học dưới dạng {@link InstructorResp}
         */
        @Query("UPDATE Course c SET c.courseName = :courseName, c.description = :description, c.learningOutcome = :learningOutcome, "
                        + "c.backgroundImg = :backgroundImg, c.startDate = :startDate, c.endDate = :endDate, c.lessonCount = :lessonCount, "
                        + "c.statusCode = :statusCode WHERE c.courseCode = :courseCode")
        void updateCourse(@Param("courseName") String courseName,
                        @Param("description") String description,
                        @Param("learningOutcome") String learningOutcome,
                        @Param("backgroundImg") String backgroundImg,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("lessonCount") int lessonCount,
                        @Param("statusCode") String statusCode,
                        @Param("courseCode") String courseCode);

        /**
         * Cập nhật thông tin khóa học theo {@link CourseCode}.
         *
         * @param courseName      Tên khóa học
         * @param description     Mô tả khóa học
         * @param learningOutcome Kết quả học được
         * @param backgroundImg   Hình nền khóa học
         * @param startDate       Ngày bắt đầu khóa học
         * @param endDate         Ngày kết thúc khóa học
         * @param lessonCount     Số lượng bài học
         * @param statusCode      Trạng thái khóa học
         * @param courseCode      Mã khóa học
         */
        @Query("SELECT new com.example.backend.dto.response.CourseResp(c.id, c.courseCode, c.courseName, c.description, c.learningOutcome, c.lessonCount, "
                        +
                        "c.startDate, c.endDate, c.statusCode, c.backgroundImg) FROM Course c WHERE c.id = :courseId")
        Optional<CourseResp> findCourseRespByCourseId(@Param("courseId") Long courseId);

}
