package com.example.backend.service;

import com.example.backend.dto.request.CourseFilterReq;
import com.example.backend.dto.request.CreateCourseReq;
import com.example.backend.dto.request.UpdateCourseReq;
import com.example.backend.dto.response.CourseDetailResp;
import com.example.backend.dto.response.CourseResp;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * Interface định nghĩa các chức năng liên quan đến quản lý khóa học.
 */
public interface CourseService {

    /**
     * Lấy tất cả khóa học (không phân trang).
     *
     * @return danh sách tất cả các khóa học
     */
    List<CourseResp> getAllCourses();

    /**
     * Lấy khóa học theo ID.
     *
     * @param id ID của khóa học
     * @return thông tin khóa học
     */
    CourseResp getCourseById(Long id);

    /**
     * Lấy khóa học theo mã khóa học.
     *
     * @param courseCode mã khóa học
     * @return thông tin khóa học
     */
    CourseResp getCourseByCode(String courseCode);

    /**
     * Tạo mới một khóa học.
     *
     * @param req thông tin khóa học cần tạo
     * @return thông tin khóa học vừa được tạo
     */
    CourseResp createCourse(CreateCourseReq req);

    /**
     * Lấy thông tin chi tiết của một khóa học theo ID.
     *
     * @param courseId ID của khóa học
     * @return đối tượng CourseDetailResp chứa thông tin chi tiết khóa học
     */
    CourseDetailResp getCourseDetail(Long courseId);

    /**
     * Tìm kiếm khóa học theo nhiều tiêu chí và có phân trang.
     *
     * @param req điều kiện lọc và phân trang
     * @return trang kết quả chứa danh sách khóa học
     */
    Page<CourseResp> filterCourses(CourseFilterReq req);

    /**
     * Cập nhật thông tin khóa học và danh sách bài giảng đi kèm.
     *
     * @param req thông tin khóa học cần cập nhật
     * @return đối tượng CourseDetailResp sau khi cập nhật
     */
    CourseDetailResp updateCourse(UpdateCourseReq req);


}
