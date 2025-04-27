package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho việc sinh viên ghi danh vào khóa học.
 */
@Entity
@Table(name = "STUDENT_ENROLLMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "STUDENT_ID", referencedColumnName = "id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "COURSE_ID", referencedColumnName = "id")
    private Course course;

    @Column(name = "ENROLLMENT_DATE")
    private LocalDateTime enrollmentDate = LocalDateTime.now();

    @Column(name = "PROGRESS_PERCENTAGE")
    private Integer progressPercentage = 0;

    @Column(name = "NOTE", columnDefinition = "nvarchar(255)")
    private String note;
}
