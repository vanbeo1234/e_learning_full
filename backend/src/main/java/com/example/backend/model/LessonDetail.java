package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LESSON_DETAIL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "LESSON_CODE")
    private String lessonCode;

    @Column(name = "LESSON_ORDER")
    private Integer lessonOrder;

    @Column(name = "LESSON_NAME")
    private String lessonName;

    @Column(name = "VIDEO_LINK")
    private String videoLink;

    @Column(name = "RESOURCE_LINK")
    private String resourceLink;

    @ManyToOne
    @JoinColumn(name = "COURSE_ID")
    private Course course;
}
