package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCourseReq {
    @NotNull(message = "Student ID không được để trống")
    private Long studentId;

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;
}
