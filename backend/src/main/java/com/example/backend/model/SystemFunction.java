package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "SYSTEM_FUNCTION")
public class SystemFunction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FUNCTION_NAME", nullable = false)
    private String functionName;

    @Column(name = "DESCRIPTION")
    private String description;
}
