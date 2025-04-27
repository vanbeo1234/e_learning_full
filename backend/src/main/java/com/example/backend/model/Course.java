package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "COURSE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COURSE_CODE")
    private String courseCode;

    @Column(name = "COURSE_NAME")
    private String courseName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "LESSON_COUNT")
    private int lessonCount;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "START_DATE")
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "STATUS_CODE")
    private String statusCode;

    @Column(name = "LEARNING_OUTCOME")
    private String learningOutcome;

    @Column(name = "BACKGROUND_IMG")
    private String backgroundImg;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

}
