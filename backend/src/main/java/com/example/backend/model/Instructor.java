package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INSTRUCTOR_ENROLLMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "COURSE_ID", referencedColumnName = "id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "INSTRUCTOR_ID", referencedColumnName = "id")
    private User instructor;

}
