package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

/**
 * CourseFilterReq: DTO chứa điều kiện lọc và phân trang khi lấy danh sách khóa
 * học.
 */
@Getter
@Setter
public class CourseFilterReq {
    private String courseName;
    private String instructorName;
    private String instructorId;
    private Long studentId;
    private String statusCode;
    private String createdBy;
    private LocalDate createdDate;
    private int pageNumber = 0;
    private int pageSize = 10;
}
