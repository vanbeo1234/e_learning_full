package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CourseFilterResp {
    private int errorStatus;
    private String message;
    private List<CourseResp> data;
    private PaginationResp pagination;
}
