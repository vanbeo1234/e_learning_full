package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.example.backend.common.Enum;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_CODE", nullable = false, unique = true)
    private String userCode;

    @Column(name = "ENCRYPTION_KEY")
    private String encryptionKey;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "GENDER", nullable = false)
    private Integer gender;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDateTime dateOfBirth;

    @Column(name = "ROLE_ID", nullable = false)
    private int roleId;

    @Column(name = "STATUS_CODE", nullable = false)
    private String statusCode;

    @Column(name = "EXPERIENCE")
    private Integer experience;

    @Column(name = "CERTIFICATION")
    private String certification;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "CREATED_AT", updatable = false)
    private Timestamp createdAt;

    @Column(name = "UPDATED_AT")
    private Timestamp updatedAt;

    public Enum.Role getRole() {
        return Enum.Role.fromInt(this.roleId);
    }

    public void setRole(Enum.Role role) {
        this.roleId = role.getValue();
    }
}
